import { Control } from "./control";
import { View } from "./view";

const content = <HTMLDivElement>document.getElementById('content');
const view = new View(content);
view.layout();
const control = new Control();
control.bindAll();
