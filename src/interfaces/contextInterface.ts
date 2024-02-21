import { UserInterface } from "./userInterface";

export interface MyContext {
    user?:UserInterface|null
    token?:string|undefined
}