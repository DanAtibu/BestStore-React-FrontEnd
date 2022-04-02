import { firestore } from './firebase';
import { doc, getDoc, collection, onSnapshot, updateDoc, arrayUnion, Timestamp, setDoc } from "firebase/firestore";


class FireBase {
    constructor () {}
    Init = async ( User = {} ) => {
        this.User = User;
        this.Parent = "Stores";
        this.StoreName = this.User.Store;
        this.firestore = firestore;
        this.Store = doc(this.firestore, this.Parent, this.StoreName);
        return await this.Config();
    }

    Config = async () => {
        return await getDoc( this.Store ).then( ref_to_store => {
            this.StoreData = { id: ref_to_store.id, ...ref_to_store.data() }
            this.StoreReference = ref_to_store;

            this.Category = collection(this.StoreReference.ref, "CategoryProduct");
            this.Product = collection(this.StoreReference.ref, "Product");
            this.Stock = collection(this.StoreReference.ref, "Stock");
            this.Sale = collection(this.StoreReference.ref, "Sale");

            this.Product_Category_Ref = {};
            window.FireBase = this;
            return this;
        }).catch ( error => {
            return this;
        });
    }

    Acces = () => {}

    Save = async ( document, data, CallBack) => {
        updateDoc( document, data ).then( CallBack ).catch( CallBack );
    }

    SaveSale = ( data, CallBack ) => {
        for ( let i of data ) {
            i.Name = doc( firestore, i.Path );
            ["Path", "id"].map( key => delete i[ key ] );
        }
        const Data_To_Send = {};
        const DT = new Date();
        const fireDate = `${ DT.getFullYear() }-${ DT.getMonth() + 1 }-${ DT.getDate() }`;
        Data_To_Send.Sale = arrayUnion({
            Product: data,
            createdAt: Timestamp.fromDate( new Date() ),
            UserId: this.User.Id,
            Username: this.User.Name,
        });
        Data_To_Send.createdAt = Timestamp.fromDate( new Date() );
        setDoc( doc( this.Sale, fireDate ), Data_To_Send, { merge: true } ).then( CallBack ).catch( CallBack );
    }


    GetData = async ( Collection_Ref, CallBack = () => {} ) => {
        onSnapshot( Collection_Ref, res => CallBack( res ) );
    }


    GetCategory = async ( CallBack ) => {
        await this.GetData( this.Category, ( response ) => {
            this.CategoriesDocs = [];
            var Cat = [];
            for ( let cat of response.docs ) {
                let data = cat.data();
                this.CategoriesDocs.push({ id: cat.id, doc: cat });
                Cat.push({id: cat.id, ...data, createdAt: data.createdAt.toDate().toLocaleString() })
            }
            CallBack( Cat );
        });
    }


    GetProduct = async ( CallBack ) => {
        await this.GetData( this.Product, async ( PList ) => {
            let CleanResponse = PList.docs.map( item => ( { id: item.id, Path: item.ref.path, ...item.data() }) );
            for( let item of CleanResponse ) {
                if ( !( item.Category.path in this.Product_Category_Ref ) ) {
                    let Key = item.Category.path;
                    item.Category = await this.GetDocument( item.Category.path, true );
                    item.Category.createdAt = item.Category.createdAt.toDate().toLocaleString();
                    this.Product_Category_Ref[ Key ] = item.Category;
                } else {
                    item.Category = this.Product_Category_Ref[ item.Category.path ]
                }
                item.createdAt = item.createdAt.toDate().toLocaleString();
            };
            CallBack( CleanResponse );
        });
    }


    GetStock = async ( CallBack ) => {
        await this.GetData( this.Stock, async ( SList ) => {
            // SList.forEach( async item => {
            //     item.Product.forEach( async prod => {
            //         prod.ProductName = ( await getDoc( doc( this.StoreReference.ref, prod.ProductName.path ) ) ).data();
            //         delete prod.ProductName.Category;
            //     });
            // });
            CallBack( SList);
        });
    }


    GetSale = async (path, CallBack ) => {
        const SaleRef = path ? doc( this.StoreReference.ref, path ) : this.Sale
        await this.GetData( SaleRef, async ( Data ) => {
            let Parser = async ( Doc ) => {
                var Sale_Day_Obj = { id: Doc.id, ...Doc.data() }
                Sale_Day_Obj.createdAt = Sale_Day_Obj.createdAt.toDate().toLocaleString();
                for( var item_sale of Sale_Day_Obj.Sale ) {
                    for ( var product of item_sale.Product ) {
                        let { id= null, Name= "----" } = await this.GetDocument( product.Name.path, true );
                        product.Name = { id, Name }
                    }
                    item_sale.createdAt = item_sale.createdAt.toDate().toLocaleString();
                }
                return Sale_Day_Obj;
            };
            CallBack( await Parser( Data ) );
        });
    }

    GetDocument = async ( path, Once=false, Callback = () => {}) => {
        const doc_ref = doc( firestore, path );
        if ( Once ) {
            let Res = await getDoc( doc_ref ).then( res => ({id: res.id, ...res.data(), exist: res.exists() }) ).catch( error => ({}) );
            Callback( Res );
            return Res;
        } else {
            onSnapshot( doc_ref, res => Callback( res.data() ) )
        }
    }
}

export default FireBase