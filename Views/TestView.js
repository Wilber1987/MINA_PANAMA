import { WRender, WArrayF, ComponentsManager, WAjaxTools } from '../WDevCore/WModules/WComponentsTools.js';
import { WCssClass } from '../WDevCore/WModules/WStyledRender.js';
const DOMManager = new ComponentsManager();
class WTestConfig {
    Title = "Title";
    Descripcion = "descripcion....";
    YEAR = "";
    MES = "";
    COMPONENTE = "";
    INDICADOR = "";
    Questions = [{ CRITERIO: "CRITERIO", EXPEDIENTE: "", Value: "SI" }];
}
class WTestView extends HTMLElement {
    constructor(Config = (new WTestConfig())) {
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.GoogleForm = "https://docs.google.com/forms/d/e/1FAIpQLSf1XMp3hGlTl69mvPJbPpK0hdyxzu9i43l20zZdVvTJJaVU4A/viewform";
        this.Config = Config;
        this.MainTestContainer = WRender.createElement({
            type: "div", props: { class: "MainTestContainer" }
        });
        this.MainTestContainer.append(WRender.CreateStringNode(`<h3>${this.Config.Title}</h3>`));
        this.MainTestContainer.append(WRender.CreateStringNode(`<p>${this.Config.Descripcion}</p>`));
        this.MainTestContainer.append(this.DrawTest(this.Config.Questions));
        this.shadowRoot.append(this.MainTestContainer);
        this.Resps = ["SI", "NO", "N/A"];
    }
    connectedCallback() {
        this.DrawComponent();
    }
    DrawComponent = () => { }
    DrawTest = (Questions = this.Config.Questions) => {
        const ContainerQuestions = WRender.createElement({
            type: "div", props: { class: "ContainerQuestions" }
        });
        Questions.forEach(element => {
            const RespContainer = WRender.createElement({ type: "div", props: { class: "RespContainer" } });
            this.Resps.forEach(Resp => {
                RespContainer.append(WRender.createElement([
                    { type: 'label', props: { innerText: Resp, htmlFor: "Control" + element.Id + Resp } },
                    {
                        type: 'input', props: {
                            type: 'radio', id: "Control" + element.Id + Resp, name: "Resp" + element.Id,
                            value: Resp, onchange: (ev) => {
                                element.Value = ev.target.value;
                            }
                        }
                    }
                ]))
            });
            const QuestionControl = WRender.createElement({
                type: "div", props: { class: "QuestionControl" }, children: [
                    element.CRITERIO, RespContainer
                ]
            });
            ContainerQuestions.append(QuestionControl);
        });
        return ContainerQuestions;
    }
    SaveGoogleForm = async (ElementForm = (new WTestConfig()).Questions[0]) => {
        const url = this.GoogleForm;
        const data = {
            "entry.1446800977": this.Config.YEAR,
            "entry.53598846": this.Config.MES,
            "entry.1335627763": this.Config.COMPONENTE,
            "entry.570676050": this.Config.INDICADOR,
            "entry.1474905730": ElementForm.CRITERIO,
            "entry.1672193964": ElementForm.EXPEDIENTE,
            "entry.609427820": ElementForm.Value,
        }
        $.ajax({
            url: url,
            data: data,
            type: "POST",
            dataType: "xml",
            statusCode: {
                0: function () {
                    alert("success 0")
                    location.reload();
                },
                200: function () {
                    alert("success 200")
                    //     window.location.replace("Success.html");
                }
            }
        });
    }
}
customElements.define('w-test', WTestView);
export { WTestView }