async function indexedDB(){
    return new Promise((resolve, reject)=>{
        const indexedDB =
        window.indexedDB 
    
        if (!indexedDB) {
            console.log("IndexedDB could not be found in this browser.");
            reject("IndexedDB could not be found in this browser.")
        }
    
        const dbName="Fileshare"
        const request = window.indexedDB.open(dbName, 3);
        request.onerror = (event:any) => {
            console.log(event.target.result)
        };
    
        request.onsuccess=(event:any)=>{
            resolve(event.target.result);
        }

        request.onupgradeneeded = (event:any) => {
            const db = event.target.result;
            const objectStore = db.createObjectStore("All_files", { keyPath: "path" });
        
            objectStore.createIndex("category", ["category"], { unique: false });
            objectStore.createIndex("product_name", ["product_name"], { unique: false });
            objectStore.createIndex("image_url", ["image_url"], { unique: true });
            objectStore.createIndex("price", ["price"], { unique: false });
            objectStore.createIndex("payment", ["payment"], { unique: false });
        };
    });
}
export default indexedDB;