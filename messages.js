"use strict"
///contains:
/// class Messages (squre with controls behind) 
/// class FbMessages (one line of text in front)
var currentFbMessage = null;

class Messages {

    plane = BABYLON.Mesh.CreatePlane("plane", 10);
    advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(this.plane);
    currentScreen = "init";
    nextButton;
    constructor() {
        this.plane.position.z = -25;
        this.plane.position.y = 2;/////2
        this.plane.position.x = 0;
        this.plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;///without iא its mirror

        this.textField = new BABYLON.GUI.TextBlock("upperText");

        this.advancedTexture.background = 'green'


        this.nextButton = BABYLON.GUI.Button.CreateSimpleButton("but1", "המשך");
        this.nextButton.width = 1;
        this.nextButton.height = 0.4;
        this.nextButton.color = "white";
        this.nextButton.fontSize = 50;
        this.nextButton.background = "green";
        this.nextButton.onPointerUpObservable.add(this.screenDone.bind(this));
        this.nextButton.top = "90px";//90
        this.nextButton.left = "10px";
        this.nextButton.height = "70px";
        this.advancedTexture.addControl(this.nextButton);
        

        const initialText = "במסך זה יופיעו הנחיות\n\n מאחוריך מספר לבנים לבניית המודל\n\n[אחרי שראינו את האבנים יש להקליק על כפתור [המשך\nהקלקה פרושה להצביע עם הקרן על הכפתור וללחוץ על ההדק";
        let text1 = this.textField;
        text1.text = initialText;//"Hello world";
        text1.color = "white"//"red";
        text1.fontSize = 36;
        text1.top = "-300px";
        text1.height = "600px"
        this.advancedTexture.addControl(text1);

        //this.advancedTexture.focusedControl = inputTextArea;///create bug
        //plane.isVisible = true;
        //plane.dispose();

    }

    ///switch screens by currentScreen. convention:
    /// use function show<CurrentScreen> to show the new screen
    /// use function done<CurrentScreen> if the screen need dispose objects or implemnt user data
    screenDone() {
        switch (this.currentScreen) {
            case "init":
                //this.showPic();/////
                this.showEditID();
                break;
            case "editID":
                let id = this.doneEditID();
                if (id == "record") {
                    this.showModel2record();
                } else {
                    if (id == "takePics") {
                        this.showModel2takePics();
                    } else {
                        this.showEditGroup();
                    }
                }
                break;
            case "model2record":
                this.doneModel2record();
                break;
            case "model2takePics":
                this.doneModel2takePics();
                break;
            case "editGroup":
                let group = this.doneEditGroup();
                this.showSelectBlock()
                break;
            case "selectBlock":
                this.showInsButtons();
                break;
            case "insButtons":
                //this.showConnect();
                currentSession.initSession();
                this.showGroupIstructions();
                break;
            case "GroupIstructions":
                //this.showGroupIstructions();
                this.showConnect();
                this.currentScreen = "end";
                break;
            case "examA":
                //this.showConnect();
                currentSession.initExamA();
                this.nextButton.isEnabled = false;
                break;
            case "examB":
                //this.showConnect();
                currentSession.initExamB();
                this.nextButton.isEnabled = false;
                break;
            default:
                console.log("default: " + this.currentScreen);
                break;
        }
    }

    showPic() {
        console.log("in showPic");
        this.textField.text = "foo";
        let image = new BABYLON.GUI.Image("but");
        image.source = "textures/pink_py.png";
        ////image.heightInPixels = 1000;
        //image.widthInPixels = 1000; 
        //image.top = "20px";   
        this.advancedTexture.addControl(image);
        console.log("image.top: " + image.top)
    }

    showEditID() {
        this.currentScreen = "editID";
        this.textField.text = "יש להקליק בתוך השדה השחור. תופיע מקלדת\nיש לקליק בה את המספר שקבלת ממנהלת הניסוי"

        this.nextButton.isEnabled = false;

        let inputTextArea = new BABYLON.GUI.InputText('id', "");
        inputTextArea.height = "40px";
        inputTextArea.color = "white";
        inputTextArea.fontSize = 48;
        inputTextArea.top = "-120px";
        inputTextArea.height = "70px";
        inputTextArea.width = "200px";
        inputTextArea.onTextChangedObservable.add(() => this.nextButton.isEnabled = true);
        this.advancedTexture.addControl(inputTextArea);

        const keyboard = new BABYLON.GUI.VirtualKeyboard("vkb");
        keyboard.addKeysRow(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "\u2190"]);
        keyboard.connect(inputTextArea);
        keyboard.top = "-10px";
        keyboard.scaleY = 2;
        keyboard.scaleX = 2;
        //keyboard.left = "10px";
        this.advancedTexture.addControl(keyboard);
    }

    doneEditID() {
        let idInputfield = this.advancedTexture.getControlByName("id");
        let theId = idInputfield.text;
        //console.log("theId: " + theId);
        if (theId == "record") {
            ///no session. will continue in showModel2record when we will return "record"
        }
        else {
            currentSession = new Session(theId);
        }
        this.advancedTexture.removeControl(idInputfield);
        idInputfield.dispose();
        let idKeyboard = this.advancedTexture.getControlByName("vkb");
        this.advancedTexture.removeControl(idKeyboard);
        idKeyboard.dispose();
        return theId;
    }
    /////RECORD MODE without session
    showModel2record() {
        this.currentScreen = "model2record";
        near = createNearMenu("record");
        near.isVisible = true;

        this.textField.text = "שם המודל"

        let inputTextArea = new BABYLON.GUI.InputText('id', "");
        inputTextArea.height = "40px";
        inputTextArea.color = "white";
        inputTextArea.fontSize = 48;
        inputTextArea.top = "-120px";
        inputTextArea.height = "70px";
        inputTextArea.width = "200px";
        this.advancedTexture.addControl(inputTextArea);

        const keyboard = new BABYLON.GUI.VirtualKeyboard("vkb");
        keyboard.addKeysRow(["man", "car", "dog", "chair", "\u2190"]);
        keyboard.connect(inputTextArea);
        keyboard.top = "-10px";
        keyboard.scaleY = 2;
        keyboard.scaleX = 2;
        //keyboard.left = "10px";
        this.advancedTexture.addControl(keyboard);

    }

    doneModel2record() {
        this.currentScreen = "end";
        let idInputfield = this.advancedTexture.getControlByName("id");
        let theId = idInputfield.text;
        currentModel = createModel(theId, "for record", -5, 0, -5);
        this.advancedTexture.removeControl(idInputfield);
        idInputfield.dispose();
        let idKeyboard = this.advancedTexture.getControlByName("vkb");
        this.advancedTexture.removeControl(idKeyboard);
        idKeyboard.dispose();
        return theId;
    }
    /////END RECORD MODE without session

    showModel2takePics() {
        this.currentScreen = "model2takePics";
        near = createNearMenu("takePics");///for now create regular no record menu
        near.isVisible = true;

        this.textField.text = "שם המודל"

        let inputTextArea = new BABYLON.GUI.InputText('id', "");
        inputTextArea.height = "40px";
        inputTextArea.color = "white";
        inputTextArea.fontSize = 48;
        inputTextArea.top = "-120px";
        inputTextArea.height = "70px";
        inputTextArea.width = "200px";
        this.advancedTexture.addControl(inputTextArea);

        const keyboard = new BABYLON.GUI.VirtualKeyboard("vkb");
        keyboard.addKeysRow(["man", "car", "dog", "chair", "\u2190"]);
        keyboard.connect(inputTextArea);
        keyboard.top = "-10px";
        keyboard.scaleY = 2;
        keyboard.scaleX = 2;
        //keyboard.left = "10px";
        this.advancedTexture.addControl(keyboard);

    }

    doneModel2takePics() {
        this.currentScreen = "end";
        let idInputfield = this.advancedTexture.getControlByName("id");
        let theId = idInputfield.text;

        currentModel = createModel(theId, " ", -3, 0, 0);
        rebuild4pics();
        this.advancedTexture.removeControl(idInputfield);
        idInputfield.dispose();
        let idKeyboard = this.advancedTexture.getControlByName("vkb");
        this.advancedTexture.removeControl(idKeyboard);
        idKeyboard.dispose();
        return theId;
    }
    /////END TAKEPICS MODE without session
    showEditGroup() {
        this.currentScreen = "editGroup";
        this.textField.text = "יש לקליק את אות הקבוצה שקבלת ממנהלת הניסוי\n [ואז להקליק [המשך"

        this.nextButton.isEnabled = false;

        let inputTextArea = new BABYLON.GUI.InputText('group', "");
        inputTextArea.height = "40px";
        inputTextArea.color = "white";
        inputTextArea.fontSize = 48;
        inputTextArea.top = "-120px";
        inputTextArea.height = "70px";
        inputTextArea.width = "200px";
        inputTextArea.onTextChangedObservable.add(() => this.nextButton.isEnabled = true);
        this.advancedTexture.addControl(inputTextArea);

        const keyboard = new BABYLON.GUI.VirtualKeyboard("vkb");
        keyboard.addKeysRow(["A", "B", "C", "D", "E", "F", "\u2190"]);
        keyboard.connect(inputTextArea);
        keyboard.top = "-10px";
        keyboard.scaleY = 2;
        keyboard.scaleX = 2;
        //keyboard.left = "10px";
        this.advancedTexture.addControl(keyboard);
    }

    doneEditGroup() {
        let idInputfield = this.advancedTexture.getControlByName("group");
        let theGroup = idInputfield.text;
        currentSession.group = theGroup;
        this.advancedTexture.removeControl(idInputfield);
        idInputfield.dispose();
        let idKeyboard = this.advancedTexture.getControlByName("vkb");
        this.advancedTexture.removeControl(idKeyboard);
        idKeyboard.dispose();
        return theGroup;
    }

    showSelectBlock() {
        this.currentScreen = "selectBlock";
        this.textField.text = "ניתן לבחור אחת מהאבני הבניין שמאחוריך \nעל ידי הקלקה על אחת הבליטות המופיעות בה\n הבליטה תיצבע בצהוב\n\nבבקשה לבחור אבן ואז להקליק [המשך] במסך זה"
    }

    showInsButtons() {
        this.currentScreen = "insButtons";
        near = createNearMenu("no record");
        near.isVisible = true;
        this.textField.text = "מעל האבנים מופיע עכשיו מאחוריך פאנל כחול עם כפתורים\n ניתן לגרור אותו לכל מקום במסך\n\nהכפתורים יפעלו על האבן שנבחרה:\n\n [ red ] כפתורים לבחירת צבע לדוגמא \n  אבן שוכבת אופקית [ / ]\nאבן עומדת [ | ]\nאבן שוכבת אנכית [ -- ] "
    }

    showConnect() {
        this.currentScreen = "connect";
        this.textField.text = "להוספת האבן למודל יש להקליק על אחת הבליטות במודל\n[ << ] כאשר נקודה במודל ונקודה באבן נבחרו, ללחוץ על כפתור\nהאבן תוצמד למודל כך שהנקודות שנבחרו באבן ובמודל יתלכדו \n\n[ >> ] להסרת האבן האחרונה שהוספת למודל יש ללחוץ על כפתור\n\nבבקשה להסתובב ולהתחיל לבנות את המודלים\n על פי ההסברים שמעל אבני הבניין"
        this.nextButton.isEnabled = false;
    }

    showExamA() {
        this.nextButton.isEnabled = true;
        this.currentScreen = "examA";
        this.textField.text = "בשלב הבא יש לבנות מודל במינימום זמן ומינימום טעויות. \nמי שייסיים את הבנייה של שלב זה והשלב הבא המהיר ביותר יקבל בונוס \nבבקשה להקליק המשך ואז להסתובב ולהתחיל בבניה"
    }

    showExamB() {
        this.nextButton.isEnabled = true;
        this.currentScreen = "examB";
        this.textField.text = "לפניך השלב האחרון בו יש לבנות שני מודלים במינימום זמן ומינימום טעויות. \nמי שייסיים את הבנייה של שלב זה ווהקודם המהיר ביותר יקבל בונוס \nבבקשה להקליק המשך ואז להסתובב ולהתחיל בבניה"
    }

    showLastScreen() {
        this.currentScreen = "lastScreen";
        this.textField.text = "תודה רבה. הורד את המשקפיים והחזר אותם לנסיין"
        this.nextButton.isEnabled = false;
    }

    showGroupIstructions() {
        this.currentScreen = "GroupIstructions";
        switch (currentSession.group) {
            case "A":
                this.textField.text = " מימינך ומשמולך בסיסים לשמי מודלים \n ומאחורי אבני הבנין שני בסיסים נוספים";
                break;
            case "B":
                this.textField.text = " .מימינך ומשמאלך בסיסים לשני מודלים \n שני מודלים נוספים יוצגו לפניך בהמשך בעולם אחר";
                break;
            case "C":
                this.textField.text = " .משמאלך בסיס למודל \n שלושה מודלים נוספים יוצגו לפניך בהמשך בעולמות אחרים";
                break;

            default:
                break;
        }
    }
}

class FbMessages {
    dynamicTexture;
    mat;
    plane;
    picPLane;
    advancedTexture4Pic = null;
    image;
    constructor(text, x = 0, y = 2.5, z = 2, pic = null) {
        ///Set font
        var font_size = 24;
        var font = "bold " + font_size + "px Arial";

        ///Set height for plane
        var planeHeight = 0.5;

        ///Set height for dynamic texture
        var DTHeight = 1.5 * font_size; //or set as wished

        ///Calcultae ratio
        var ratio = planeHeight / DTHeight;

        ///Use a temporay dynamic texture to calculate the length of the text on the dynamic texture canvas
        var temp = new BABYLON.DynamicTexture("DynamicTexture", 64, scene);
        var tmpctx = temp.getContext();
        tmpctx.font = font;
        var DTWidth = tmpctx.measureText(text).width + 8;
        temp.dispose();
        ///Calculate width the plane has to be 
        var planeWidth = DTWidth * ratio;

        ///Create dynamic texture and write the text
        this.dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", { width: DTWidth, height: DTHeight }, scene, false);
        this.mat = new BABYLON.StandardMaterial("mat", scene);
        this.mat.diffuseTexture = this.dynamicTexture;
        this.dynamicTexture.drawText(text, null, null, font, "#000000", "#ffffff", true);

        ///Create plane and set dynamic texture as material
        this.plane = BABYLON.MeshBuilder.CreatePlane("plane", { width: planeWidth, height: planeHeight }, scene);
        this.plane.material = this.mat;
        this.plane.position.y = y;
        this.plane.position.z = z;
        this.plane.position.x = x;
        this.plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;

        ///create plane for pic instructions
        if (pic) {
            let picHeight = 1.5;
            let picWidth = 1.5;
            this.picPLane = BABYLON.MeshBuilder.CreatePlane("plane", { width: picWidth, height: picHeight }, scene);
            this.picPLane.material = this.mat;
            this.picPLane.position.y = y + picHeight / 2 + planeHeight / 2;
            this.picPLane.position.z = z;
            this.picPLane.position.x = x;
            this.picPLane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;
            this.advancedTexture4Pic = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(this.picPLane);

            this.image = new BABYLON.GUI.Image("but");
            this.image.source = pic;//"textures/pink_py.png";
            this.advancedTexture4Pic.addControl(this.image);

            this.advancedTexture4Pic.background = 'green';
        }
    }

    setY(newY) {
        this.plane.position.y = newY;
    }

    hide() {
        this.plane.isVisible = false;
    }
    show() {
        this.plane.isVisible = true;
    }
    dispose() {
        this.dynamicTexture.dispose();
        this.mat.dispose();
        this.plane.dispose();
        if (this.picPLane) {
            this.picPLane.dispose();
        }
        if (this.advancedTexture4Pic) {
            this.advancedTexture4Pic.dispose();
        }

    }
}
