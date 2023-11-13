const myObserver = new MutationObserver(function () {
    const origin = window.location.origin;
    const items = document.querySelectorAll("[id='oslc-link-btn']");
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        if (document.body.contains(element)) {
            if (!element.classList.contains('injected')) {
                element.classList.add('injected');
                let div = document.createElement('div');
                let span = document.createElement('span');
                let btn = document.createElement('button');
                div.className = "container-div";
                btn.className = "btn-wbe";
                if (items.length === 2) {
                    span.className = "btn-wbe2"
                }
                btn.innerHTML = 'Link Editor &nbsp &nbsp' + icon;
                span.appendChild(btn)
                div.appendChild(span);
                element.appendChild(span);
                const resource = document.getElementById('entity-name');
                let projectName = window.location.hostname; //  ui-stage.glideyoke.com/
                if (projectName === 'ui-stage.glideyoke.com') {
                    projectName = "master";
                }
                const type = resource?.baseURI.split('/')[4]; //Get substring from URI: https://ui-stage.glideyoke.com/detail/Issue/9f4badce-2a41-49a6-bad1-57797c227b70/properties
                console.log("Source type: " + type +
                  "\nTitle: " + resource?.textContent +
                  "\nProject: " + projectName +
                  "\nURI: " + resource?.baseURI +
                  "\nOrigin: " + origin +
                  "\nAppName: " + "Glide");

                btn.addEventListener("click",
                  function () {
                      openDialogOSLC({
                            title: resource?.textContent,
                            uri: resource?.baseURI,
                            origin: origin,
                            appName: 'glide',
                            sourceType: type,
                            project: projectName
                        })
                    });
            }
        }
    }
});

myObserver.observe(document, {
    subtree: true,
    attributes: true,
});
