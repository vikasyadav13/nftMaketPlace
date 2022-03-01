/* Moralis init code */
const serverUrl = "https://xvcevtayktez.usemoralis.com:2053/server";
const appId = "IWA2GEzS6MQg2PjYW6ygyN3R0shqcUGUZsC8yapo";
Moralis.start({ serverUrl, appId });

init = async () => {
  hideElement(userInfo);
  hideElement(createItemForm);
  window.web3 = await Moralis.enableWeb3();
  initUser();
}

initUser = async () => {
    if (await Moralis.User.current()){
        hideElement(userConnectButton);
        showElement(userProfileButton);
        showElement(openCreateItemButton);
    }else{
        showElement(userConnectButton);
        hideElement(userProfileButton);
        hideElement(openCreateItemButton);
    }
}
login = async () => {
    try {
        await Moralis.Web3.authenticate();
        initUser();
    } catch (error) {
        alert(error);

    }
}
logout = async () => {
    
        await Moralis.User.logOut();
        hideElement(userInfo);
        initUser();
    } 


openUserInfo = async () => {
  user = await Moralis.User.current();
  if (user){
    const email = user.get('email');
    if(email){
      userEmailField.value = email;
    }else{
      userEmailField.value = "";
    }

    userUsernameField.value = user.get('username');
    const userAvatar = user.get('avatar');
    if(userAvatar){
      userAvatarImg.src = userAvatar.url();
      showElement(userAvatarImg);
    }else{
      hideElement(userAvatarImg);
    }

    showElement(userInfo);
  }else{
      login(); 
  }
  }
  
saveUserInfo = async () => {
  user.set('email', userEmailField.value);
  user.set('username', userUsernameField.value);
  
  if (userAvatarFile.files.length > 0) {
    

    const avatar = new Moralis.File("avatar.jpg", userAvatarFile.files[0]);
    user.set('avatar', avatar);
  }
  await user.save();
  alert("User Info saved successfully ")
  openUserInfo();
} 

createItem = async () => {
  if (createItemFile.files.length == 0){
    alert("please select a file!");
    return;
  } else if (createItemNameField.value.length == 0){
    alert("please give");
    return;
  }

  const nftFile = new Moralis.File("nftFile.jpg", createItemFile.files[0]);
  await nftFile.saveIPFS();

  const nftFilePath = nftFile.ipfs();
  const nftFileHash = nftFile.hash();

  const metadata = {
    name: createItemNameField.value, 
    description: createItemDescriptionField.value, 
    nftFilePath: nftFilePath, 
    nftFileHash: nftFileHash, 
  };
  
  const nftFileMatadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
   await nftFileMatadataFile.saveIPFS();

   const nftFileMatadataFilePath = nftFileMatadataFile.ipfs();
   const nftFileMatadataFileHash = nftFileMatadataFile.hash();

   const Item = Moralis.Object.extend("Item");

   // Create a new instance of that class.
   const item = new Item();
   item.set('name', createItemNameField .value);
   item.set('description', createItemDescriptionField.value);
   item.set('nftFilePath', nftFilePath );
   item.set('nftFileHash', nftFileHash);
   item.set('metadataFilePath', nftFileMatadataFilePath);
   item.set('metadataFileHash', nftFileMatadataFileHash);
   await item.save();
   console.log(item);
   }

hideElement = (element) => element.style.display = "none";
showElement = (element) => element.style.display = "block";

// navbar


const userConnectButton = document.getElementById("btnConnect");
userConnectButton.onclick = login;

const userProfileButton = document.getElementById("btnUserInfo");
userProfileButton.onclick = openUserInfo ;

const openCreateItemButton =  document.getElementById("btnOpenCreateItem");
openCreateItemButton.onclick = () => showElement(createItemForm);

// userprofile

const userInfo = document.getElementById("userInfo");
const userUsernameField = document.getElementById("txtUsername");
const userEmailField = document.getElementById("txtEmail");
const userAvatarImg = document.getElementById("imgAvatar");
const userAvatarFile = document.getElementById("fileAvatar");



document.getElementById("btnCloseUserInfo").onclick = () => hideElement(userInfo) ;
document.getElementById("btnLogout").onclick = logout ;
document.getElementById("btnSaveUserInfo").onclick = saveUserInfo;

// itemcreation

const createItemForm =  document.getElementById("createItem");

const createItemNameField =  document.getElementById("txtCreateItemName");
const createItemDescriptionField =  document.getElementById("txtCreateItemDescription");
const createItemPriceField =  document.getElementById("numCreateItemPrice");
const createItemStatusField =  document.getElementById("selectCreateItemStatus");
const createItemFile   =  document.getElementById("fileCreateItemFile");


document.getElementById("btnCloseCreateItem").onclick = () =>  hideElement(createItemForm);
document.getElementById("btnCreateItem").onclick = createItem;
init();

  