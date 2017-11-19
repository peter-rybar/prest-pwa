
import { JsonMLs } from "./prest/jsonml/jsonml";
import { Widget } from "./prest/jsonml/jsonml-widget";
import { Signal } from "./prest/signal";
import { swInit, showNotification } from "./sw-lib";


class HelloWidget extends Widget {

    private _name: string;

    constructor(name: string) {
        super("HelloWidget");
        this._name = name;
    }

    setName(name: string): this {
        this._name = name;
        this.update();
        return this;
    }

    onMount() {
        console.log("onMount", this.type, this.id);
    }

    onUmount() {
        console.log("onUmount", this.type, this.id);
    }

    render(): JsonMLs {
        return [
            ["h2.ui.header", this.type],
            ["div.ui.input.left.icon",
                ["input~i", { type: "text", value: this._name, input: this._onTextInput }],
                ["i.icon.users"]
            ],
            ["div.ui.divider"],
            ["p", "Hello ", ["strong", this._name], " !"]
        ];
    }

    private _onTextInput = (e: Event) => {
        const i = e.target as HTMLInputElement;
        // const i = this.refs["i"] as HTMLInputElement;
        this._name = i.value;
        this.update();
    }

}


class TimerWidget extends Widget {

    private _interval: number;

    constructor() {
        super("TimerWidget");
    }

    toggle(on?: boolean): void {
        switch (on) {
            case true:
                if (!this._interval) {
                    this._interval = setInterval(() => this.update(), 1000);
                }
                break;
            case false:
                if (this._interval) {
                    clearInterval(this._interval);
                    this._interval = undefined;
                }
                break;
            default:
                this.toggle(!this._interval);
        }
        this.update();
    }

    onMount() {
        console.log("onMount", this.type, this.id);
        this.toggle(true);
    }

    onUmount() {
        console.log("onUmount", this.type, this.id);
        this.toggle(false);
    }

    render(): JsonMLs {
        return [
            ["h2.ui.header", this.type],
            ["p", { style: this._interval ? "" : "color: lightgray;" },
                "Time: ", new Date().toLocaleTimeString(),
            ],
            ["button.ui.button.icon.labeled.tiny", { click: (e: Event) => this.toggle() },
                ["i.icon", { classes: this._interval ? "pause" : "play"}],
                this._interval ? "Stop" : "Start"
            ]
        ];
    }

}


interface FormData {
    name: string;
    age: number;
}

interface FormErrors {
    name: string;
    age: string;
}

class FormWidget extends Widget {

    private _title: string = "Form";
    private _data: FormData = { name: undefined, age: undefined };
    private _errors: FormErrors = { name: "", age: "" };

    readonly sigData = new Signal<FormData>();

    constructor() {
        super("FormWidget");
    }

    getTitle(): string {
        return this._title;
    }

    setTitle(title: string): this {
        this._title = title;
        this.update();
        return this;
    }

    getData(): FormData {
        return this._data;
    }

    setData(data: FormData): this {
        this._data = data;
        this.update();
        return this;
    }

    onMount() {
        console.log("onMount", this.type, this.id);
    }

    onUmount() {
        console.log("onUmount", this.type, this.id);
    }

    render(): JsonMLs {
        return [
            ["h2.ui.header", this.type,
                ["div.sub.header", this._title]
            ],
            ["form.ui.form.error", { submit: this._onFormSubmit },
                ["div.field.inline", { class: this._errors.name ? "error" : "" },
                    ["label", "Name ",
                        ["input~name",
                            {
                                type: "text", size: 10, maxlength: 10,
                                placeholder: "Name",
                                input: this._onNameInput
                            }
                        ]
                    ],
                    ["div.error", this._errors.name]
                ],
                // ["div.ui.message.error", this._errors.name],
                ["div.field.inline", { class: this._errors.age ? "error" : "" },
                    ["label", "Age ",
                        ["input~age",
                            {
                                type: "number", min: "1", max: "120",
                                input: this._onAgeInput
                            }
                        ]
                    ],
                    ["div.error", this._errors.age]
                ],
                // ["div.ui.message.error", this._errors.age],
                ["div.field",
                    ["button.ui.button~submit", { type: "submit" }, "Submit"]
                ]
            ],
            ["pre~data"]
        ];
    }

    private _onFormSubmit = (e: Event) => {
        e.preventDefault();
        console.log("submit", this._data);
        this._validateName((this.refs["name"] as HTMLInputElement).value);
        this._validateAge((this.refs["age"] as HTMLInputElement).value);
        if (this._errors.name || this._errors.age) {
            this.update();
        } else {
            this.sigData.emit(this._data);
            this.refs["data"].innerText = JSON.stringify(this._data, null, 4);
        }
    }

    private _onNameInput = (e: Event) => {
        const i = e.target as HTMLInputElement;
        // const i = this.refs["name"] as  HTMLInputElement;
        console.log("name", i.value);
        this._validateName(i.value);
        this.update();
    }

    private _onAgeInput = (e: Event) => {
        const i = e.target as HTMLInputElement;
        // const i = this.refs["age"] as  HTMLInputElement;
        console.log("age", i.value);
        this._validateAge(i.value);
        this.update();
    }

    private _validateName(name: string) {
        if (name) {
            this._data.name = name;
            this._errors.name = "";
        } else {
            this._data.name = undefined;
            this._errors.name = "Name required";
        }
    }

    private _validateAge(age: string) {
        if (age) {
            if (isNaN(Number(age))) {
                this._data.age = undefined;
                this._errors.age = "Invalid age number";
            } else {
                this._data.age = Number(age);
                this._errors.age = "";
            }
        } else {
            this._data.age = undefined;
            this._errors.age = "Age required";
        }
    }

}


class AppWidget extends Widget {

    private _title: string = "App";

    readonly helloWidget: HelloWidget;
    readonly timerWidget: TimerWidget;
    readonly formWidget: FormWidget;

    constructor() {
        super("AppWidget");
        this.helloWidget = new HelloWidget("peter");
        this.timerWidget = new TimerWidget();
        this.formWidget = new FormWidget();
        this.formWidget.sigData.connect(data => console.log("sig data", data));
    }

    setTitle(title: string): this {
        this._title = title;
        this.update();
        return this;
    }

    onMount() {
        console.log("onMount", this.type, this.id);
    }

    onUmount() {
        console.log("onUmount", this.type, this.id);
    }

    render(): JsonMLs {
        return [
            ["h2.ui.header", this.type,
                ["div.sub.header", this._title]
            ],
            ["div.ui.segment",
                this.helloWidget
            ],
            ["div.ui.segment",
                this.timerWidget
            ],
            ["div.ui.segment",
                this.formWidget
            ]
        ];
    }

}


swInit();

const app = new AppWidget();

app.setTitle("MyApp");
app.helloWidget.setName("Peter");
app.formWidget.setTitle("MyForm");

app.mount(document.getElementById("app"));

// app.mount(document.getElementById(app.id)); // SSR - server side rendering

setTimeout(() => {
    showNotification("Notif title", {
        body: "Notif body",
        icon: "assets/icons/ic-face.png",
        tag: "notif-tag"
        // vibrate: [200, 100, 200, 100, 200, 100, 200],
        // data: {
        //     dateOfArrival: Date.now(),
        //     primaryKey: 1
        // },
        // actions: [
        //     {action: 'explore', title: 'Explore this new world',
        //         icon: 'images/checkmark.png'},
        //     {action: 'close', title: 'Close notification',
        //         icon: 'images/xmark.png'},
        // ]
    });
}, 3000);

(self as any).app = app;

(self as any).VERSION = "@VERSION@";
