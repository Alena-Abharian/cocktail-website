import DrinkingUserManager from "../drinkingUser/UserManager";

export default class DrinkingUserFactoryManager {
    getManager(managerName, option) {
        switch (managerName) {
            case "FIREBASE":
                if (!option.db) {
                    throw new Error("option.db not found");
                }
                return new DrinkingUserManager(option.db);
                break;
            // case "LOCALE_STORAGE":
            //     return new DrinkingUserManagerLS();
            //     break;
            default:
                throw new Error("manager not found `" + managerName + "`");
                break;
        }

    }
}
