let dialog = document.createElement("dialog");

const closeDialog = () => {
  dialog.close();
  document.body.classList.remove("blur-background");
};

function openDialogOSLC(sources) {
  if (dialog.open) {
    dialog.close();
  } else {
    document.body.classList.add("blur-background");
  }
  dialog.innerHTML = `
    <div id="oslc-modal" class="main-div" >
       <header class="header-div">
          <h2 class="header-title">TraceLynx<h2>
          <div id="oslc-modal-close" class="close-button">
            <span class="close-icon"></span>
          </div>                 
       </header>

        <div id="div-frame-container" class="iframe-div">
        <iframe frameBorder="0"
        src="https://lm-dev.koneksys.com/wbe?sourceType=${sources?.sourceType}&project=${sources?.project}&title=${sources?.title}&uri=${sources?.uri}&commit=be6c5659&branch=${sources?.title}&origin=${sources?.origin}&appName=${sources?.appName}" class="iframe-target-app"></iframe>
        </div>
  </div>`;

  document.body.appendChild(dialog);
  dialog.id = "myDialog";
  dialog.showModal();
  document
    .getElementById("oslc-modal-close")
    ?.addEventListener("click", closeDialog, false);
}
