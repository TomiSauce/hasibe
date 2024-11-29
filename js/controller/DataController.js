class DataController {

    static refresh(forceRecalculation = false) {
        let storageUsed = LocalStorage.getStorageUsed(),
            storageAvail = LocalStorage.getStorageAvailable(forceRecalculation),
            total = storageUsed + storageAvail;

        DataView.refresh(storageUsed, storageAvail, 100 / total * storageUsed);
    }
    
}