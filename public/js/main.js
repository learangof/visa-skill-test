if ($("dialog[open]").length) {
    setTimeout(function () {
        let dialogs = $("dialog[open]");
        for (let i = 0; i < dialogs.length; i++) {
            var dialog = dialogs.get(i);
            dialog.close();
        }
    }, 1000);
}
