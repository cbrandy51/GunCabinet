var controller = controller || (function ($, m) {
    // data members
    var typeRadio, colorRadio;

    // utility functions
    var _validateControls = function () {
        var form = document.forms.gunInfoEdit;
        typeRadio = document.forms.gunInfoEdit.type;
        colorRadio = document.forms.gunInfoEdit.color;
        var validated = true;

        if (form.serialEdit.value == "") {
            $("#serialError").text("Serial Number must be entered.").addClass("col-sm-4 col-sm-offset-8");
            validated = false;
        }
        else if (isNaN(parseInt(form.serialEdit.value))) {
            $("#serialError").text("Serial Number needs to be a number.").addClass("col-sm-4 col-sm-offset-8");
            validated = false;
        }
        else
            $("#serialError").text("").removeClass("col-sm-4 col-sm-offset-8");


        if (form.manuEdit.value == "") {
            $("#manuError").text("A Manufacturer must be entered.").addClass("col-sm-4 col-sm-offset-8");
            validated = false;
        }
        else
            $("#manuError").text("").removeClass("col-sm-4 col-sm-offset-8");


        if (form.modelEdit.value == "") {
            $("#modelError").text("A Model must be entered.").addClass("col-sm-4 col-sm-offset-8");
            validated = false;
        }
        else
            $("#modelError").text("").removeClass("col-sm-4 col-sm-offset-8");


        if (typeRadio.value == "") {
            $("#typeError").text("A Gun Type must be selected.").addClass("col-sm-4 col-sm-offset-8");
            validated = false;
        }
        else
            $("#typeError").text("").removeClass("col-sm-4 col-sm-offset-8");


        if (form.calSelect.selectedIndex == -1 || form.calSelect.selectedIndex == 0) {
            $("#calError").text("A Caliber must be selected.").addClass("col-sm-4 col-sm-offset-8");
            validated = false;
        }
        else
            $("#calError").text("").removeClass("col-sm-4 col-sm-offset-8");


        if (colorRadio.value == "") {
            $("#colorError").text("A Gun Color must be selected.").addClass("col-sm-4 col-sm-offset-8");
            validated = false;
        }
        else
            $("#colorError").text("").removeClass("col-sm-4 col-sm-offset-8");

        return validated;
    },

    _addTableItem = function (gun) {
        var row = "<tr id='" + gun.id + "'>";

        row += "<td>" + gun.serial + "</td>";
        row += "<td>" + gun.combo() + "</td>";
        row += "<td>" + gun.caliber + "</td>";
        row += "<td>" + gun.type + "</td>";
        row += "<td>";
        row += "<button type='button' class='btn btn-sm btn-primary' id='edit" + gun.id + "'><span class='glyphicon glyphicon-pencil'></span>&nbsp;Edit</button>&nbsp;";
        row += "<button type='button' class='btn btn-sm btn-danger' id='delete" + gun.id + "'><span class='glyphicon glyphicon-trash'></span>&nbsp;Delete</button>";
        row += "</td>";
        row += "</tr>";

        $("#gunTable").append(row);

        $("#edit" + gun.id).click(function () { _editBtnClicked(gun.id) });
        $("#delete" + gun.id).click(function () { _deleteBtnClicked(gun.id) });
    },

    _clearInputForm = function () {
        var form = document.forms.gunInfoEdit;
        var mods = document.getElementById("mods");

        form.serialEdit.value = "";
        $("#serialError").text("").removeClass("col-sm-4 col-sm-offset-8");

        form.manuEdit.value = "";
        $("#manuError").text("").removeClass("col-sm-4 col-sm-offset-8");

        form.modelEdit.value = "";
        $("#modelError").text("").removeClass("col-sm-4 col-sm-offset-8");

        form.typeRifleRadio.checked = false;
        form.typePistolRadio.checked = false;
        form.typeShotgunRadio.checked = false;
        $("#typeError").text("").removeClass("col-sm-4 col-sm-offset-8");

        form.calSelect.selectedIndex = 0;
        $("#calError").text("").removeClass("col-sm-4 col-sm-offset-8");

        form.colorWoodRadio.checked = false;
        form.colorBlackRadio.checked = false;
        form.colorOliveRadio.checked = false;
        form.colorOtherRadio.checked = false;
        $("#colorError").text("").removeClass("col-sm-4 col-sm-offset-8");

        mods.checked = false;

        $("#createBtn").css("display", "inline");
        $("#saveBtn").css("display", "none").off("click");
    };

    // event handlers
    var _createBtnClicked = function () {
        if (!_validateControls())
            return;

        var form = document.forms.gunInfoEdit;
        typeRadio = document.forms.gunInfoEdit.type;
        colorRadio = document.forms.gunInfoEdit.color;

        var gun = m.createGun(
            parseInt(form.serialEdit.value),
            form.manuEdit.value,
            form.modelEdit.value,
            typeRadio.value,
            form.calSelect.value,
            colorRadio.value,
            form.modsCheck.checked);

        _addTableItem(gun);

        _clearInputForm();

        var message = "<div class='alert alert-success fade in'>";
        message += "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>";
        message += "Gun record has been created.";
        message += "</div>";
        $("#alert").html(message);
    },

    _cancelBtnClicked = function () {
        var message = "<div class='alert alert-info fade in'>";
        message += "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>";
        message += "This entry has been cancelled.";
        message += "</div>";
        $("#alert").html(message);

        _clearInputForm();
    },

    _saveBtnClicked = function (id) {
        if (!_validateControls())
            return;

        var gun = m.getGun(id);
        if (gun == null) {
            var message = "<div class='alert alert-warning'>";
            message += "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>";
            message += "This entry couldn&apos;t be found.";
            message += "</div>";
            $("#alert2").html(message);
        }

        var form = document.forms.gunInfoEdit;
        typeRadio = document.forms.gunInfoEdit.type;
        colorRadio = document.forms.gunInfoEdit.color;

        gun.serial = parseInt(form.serialEdit.value);
        gun.make = form.manuEdit.value;
        gun.model = form.modelEdit.value;
        gun.type = typeRadio.value;
        gun.caliber = form.calSelect.value;
        gun.color = colorRadio.value;
        gun.mods = form.modsCheck.checked;

        var tr = $("#" + id).children();
        tr.eq(0).text(gun.serial);
        tr.eq(1).text(gun.combo());
        tr.eq(2).text(gun.caliber);
        tr.eq(3).text(gun.type);

        m.updateGun(id, gun);

        _clearInputForm();

        var message = "<div class='alert alert-success fade in'>";
        message += "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>";
        message += "Gun ID " + id + " was saved.";
        message += "</div>";
        $("#alert").html(message);
    },

    _editBtnClicked = function (id) {
        var gun = m.getGun(id);
        if (gun == null) {
            var message = "<div class='alert alert-warning'>";
            message += "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>";
            message += "This entry couldn&apos;t be found.";
            message += "</div>";
            $("#alert2").html(message);
        }

        var form = document.forms.gunInfoEdit;
        typeRadio = document.forms.gunInfoEdit.type;
        colorRadio = document.forms.gunInfoEdit.color;
        var mods = document.getElementById("mods");

        form.serialEdit.value = gun.serial;
        form.manuEdit.value = gun.make;
        form.modelEdit.value = gun.model;
        typeRadio.value = gun.type;
        form.calSelect.value = gun.caliber;
        colorRadio.value = gun.color;
        if (gun.mods == true)
            mods.checked = true;
        else
            mods.checked = false;

        var select = form.calSelect;
        select.options[0].selected = true;
        for (x in select.options) {
            if (select.options[x].value == gun.caliber) {
                select.options[x].selected = true;
            }
        }

        $("#createBtn").css("display", "none");

        $("#saveBtn")
            .css("display", "inline")
            .off("click")
            .click(function () { _saveBtnClicked(gun.id) });
    },

    _deleteBtnClicked = function (id) {
        _clearInputForm();

        var gun = m.getGun(id)
        if (gun == null) {
            var message = "<div class='alert alert-warning'>";
            message += "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>";
            message += "This entry couldn&apos;t be found.";
            message += "</div>";
            $("#alert2").html(message);
        }

        if (m.deleteGun(id)) {
            $("#" + id).remove(); // deletes row from table

            var message = "<div class='alert alert-info'>";
            message += "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>";
            message += "Gun ID " + id + " was deleted.";
            message += "</div>";
            $("#alert").html(message);
        }
        else {
            var message = "<div class='alert alert-warning'>";
            message += "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>";
            message += "This entry couldn&apos;t be found.";
            message += "</div>";
            $("#alert2").html(message);
        }
    };

    // external functions
    var _initialize = function () {
        $("#createBtn").click(function () { _createBtnClicked() });
        $("#cancelBtn").click(function () { _cancelBtnClicked() });

        var list = m.getAllGuns();
        for (var i in list)
            _addTableItem(list[i]);

        _clearInputForm();
    };

    return {
        initialize: _initialize
    };
})(jQuery, gunModel);