var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.getSession().setMode("ace/mode/glsl");
editor.setOption("maxLines", 400);
editor.setOption("minLines", 50);
editor.setAutoScrollEditorIntoView(true);
editor.commands.addCommand({
    name: "Compile",
    bindKey: {win: "Shift-Return", mac: "Shift-Return"},
    exec: function(editor) {
        compile();
    }
});
editor.commands.addCommand({
    name: "Restrart",
    bindKey: {win: "Ctrl-Tab", mac: "Command-Tab"},
    exec: function(editor) {
        restart();
    }
});