window.$ = window.jQuery = require('jquery');

function refreshUIElements() {
    var elementlist = document.getElementById("elementlist");
    elementlist.innerHTML = "";

    options.elements.forEach((element, index) => {
        let option = document.createElement("option");
        option.innerText = element.type;

        elementlist.prepend(option)

        option.onclick = function () {
            document.getElementById("form").innerHTML = ""

            delbtn = document.createElement('button');
            delbtn.innerText = 'Delete Element';
            delbtn.onclick = function () {
                options.elements.splice(index, 1);
                refreshUIElements()
                document.getElementById("form").innerHTML = ""
                localStorage.setItem("overlays", JSON.stringify(overlaylist))
            }
            document.getElementById("form").appendChild(delbtn)

            Object.entries(element).forEach(([key, value]) => {
                let input = document.createElement('input');
                let label = document.createElement('label');
                label.innerText = key + ":";
                input.value = value;

                if (key == "type") return;

                if (typeof value == 'number') {
                    input.type = "number"
                }

                input.onchange = function () {
                    if (typeof value == 'number') {
                        element[key] = parseInt(input.value);
                    } else {
                        element[key] = input.value;
                    }
                    localStorage.setItem("overlays", JSON.stringify(overlaylist))
                };

                if (key == "color" || key == "fill") {
                    input.type = "color"
                }

                document.getElementById("form").appendChild(label)
                document.getElementById("form").appendChild(input)
            });
        }
    });
}

//-------------------------------------------------------------------------------------------------------------------------------------

function createTextForm() {
    document.getElementById("form").innerHTML = ""
    $('form').jsonForm({
        schema: {
            text: {
                "type": "string",
                "title": "Text",
                "default": "Hello, World!"
            },
            top: {
                "type": "integer",
                "title": "Top Margin",
                "default": 10
            },
            left: {
                "type": "integer",
                "title": "Left Margin",
                "default": 10
            },
            fontSize: {
                "type": "integer",
                "title": "Font Size",
                "default": 20
            },
            fontFamily: {
                "type": "string",
                "title": "Font",
                "default": "arial"
            },
            lineHeight: {
                "type": "integer",
                "title": "Line Height",
                "default": 30
            },
            textAlign: {
                "type": "string",
                "title": "Text Align",
                "enum": ["left", "center", "right"]
            },
            fontWeight: {
                "type": "integer",
                "title": "Font Weight",
                "default": 30
            },
            color: {
                "type": "string",
                "title": "color",
                "default": "#ffffff"
            }
        },
        onSubmit: function (errors, values) {
            if (errors) {
                $('#res').html('<p>I beg your pardon?</p>');
            } else {
                values.type = "text";
                options.elements.push(values);
                refreshUIElements();
                document.getElementById("form").innerHTML = ""
            }
        }
    });
}

function createRectForm() {
    document.getElementById("form").innerHTML = ""
    $('form').jsonForm({
        schema: {
            fill: {
                "type": "string",
                "title": "Fill Color",
                "default": "#fff"
            },
            top: {
                "type": "integer",
                "title": "Top Margin",
                "default": 10
            },
            left: {
                "type": "integer",
                "title": "Left Margin",
                "default": 10
            },
            width: {
                "type": "integer",
                "title": "Width",
                "default": 256
            },
            height: {
                "type": "integer",
                "title": "Height",
                "default": 256
            },
            round: {
                "type": "integer",
                "title": "Radius",
                "default": 0
            }
        },
        onSubmit: function (errors, values) {
            if (errors) {
                $('#res').html('<p>I beg your pardon?</p>');
            } else {
                values.type = "rect";
                options.elements.push(values);
                refreshUIElements();
                document.getElementById("form").innerHTML = ""
            }
        }
    });
}

function createImageForm() {
    document.getElementById("form").innerHTML = ""
    $('form').jsonForm({
        schema: {
            url: {
                "type": "string",
                "title": "Image URL",
                "default": ""
            },
            top: {
                "type": "integer",
                "title": "Top Margin",
                "default": 10
            },
            left: {
                "type": "integer",
                "title": "Left Margin",
                "default": 10
            },
            width: {
                "type": "integer",
                "title": "Width",
                "default": 256
            },
            height: {
                "type": "integer",
                "title": "Height",
                "default": 256
            }
        },
        onSubmit: function (errors, values) {
            if (errors) {
                $('#res').html('<p>I beg your pardon?</p>');
            } else {
                values.type = "image";
                options.elements.push(values);
                refreshUIElements();
                document.getElementById("form").innerHTML = ""
            }
        }
    });
}