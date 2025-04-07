import { useEffect, useState } from "react";
import LocalDatabase from "database/";

const useLocalDatabase = (userId) => {
    const [db, setDb] = useState(null);

    useEffect(() => {
        if (userId) {
            const localDBInstance = new LocalDatabase(userId, (db) => {
                setDb(localDBInstance);
            });
        }
    }, [userId]);

    return db;
}

export default useLocalDatabase;
