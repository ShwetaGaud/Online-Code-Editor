document.addEventListener("DOMContentLoaded", function() {
    let editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/javascript");

    document.getElementById("languageSelect").addEventListener("change", function() {
        let selectedLang = this.value;
        let mode = "ace/mode/" + (selectedLang === "cpp" ? "c_cpp" : selectedLang);
        editor.session.setMode(mode);
    });

    document.getElementById("runBtn").addEventListener("click", function() {
        let code = editor.getValue();  // Use Ace Editor's getValue() if applicable
        let language = document.getElementById("languageSelect").value;
    
        fetch("/run_code/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()  // Ensure CSRF token is included
            },
            body: JSON.stringify({ code: code, language: language })  // Send JSON instead of URL params
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("output").innerText = data.output || data.error;
        })
        .catch(error => console.error("Error:", error));
    });
    
    function getCSRFToken() {
        return document.cookie.split("; ")
            .find(row => row.startsWith("csrftoken="))
            ?.split("=")[1];
    }
});

function runCode() {
    let language = document.getElementById("language").value;
    let code = document.getElementById("code").value;
    
    fetch('/run/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("output").innerText = data.output;
    })
    .catch(error => {
        document.getElementById("output").innerText = "Error running code.";
    });
}
