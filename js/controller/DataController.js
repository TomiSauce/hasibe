class DataController {

    static refresh() {
        let storageUsed = LocalStorage.getStorageUsed(),
            storageAvail = LocalStorage.getStorageAvailable(),
            total = storageUsed + storageAvail;

        DataView.refresh(storageUsed, storageAvail, 100 / total * storageUsed);
    }
    
}