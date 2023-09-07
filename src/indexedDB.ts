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
            const objectStore = db.createObjectStore("All_files", { keyPath: "filename" });
            objectStore.createIndex("uploadedAt", ["uploadedAt"], { unique: false });
            objectStore.createIndex("filename", ["filename"], { unique: true });
            objectStore.createIndex("email", ["email"], { unique: false });
            objectStore.createIndex("size", ["size"], { unique: false });
            objectStore.createIndex("file", ["file"], { unique: false });
            objectStore.createIndex("type", ["type"], { unique: false });
        };
    });
}
export default indexedDB;