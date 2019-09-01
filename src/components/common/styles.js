export default theme=>({
    appBar: {
        position: 'fixed',
    },
    rootWraper:{
        marginTop:64
    },
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    inputSearch: {
        marginLeft: 8,
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    flex: {
        flex: 1,
    },
    wrapperUpload: {
        border: "3px dashed #ccc",
        padding: 10,
        display: "flex",
        justifyContent: "center"
    },
    wrapperUploader: {

    },
    wrapperTitle: {
        color: "#717171de",
        fontWeight: "bold"
    },
    button: {
        margin: theme.spacing.unit,
        color: "#717171de",
        cursor:"pointer",
        padding:"10px 30px"
    },
    input: {
        display: 'none',
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    leftIcon:{
        marginRight: theme.spacing.unit,
    },
    flexCenter:{
        display: "flex",
        alignItems: 'center',
        justifyItems: "center",
    },
    uploadLoading:{
        width:"100%"
    },
    textLoadingUpload:{
        fontWeight:"bold",
        textAlign:"center"
    },
    titleTileBar:{
        fontSize:11
    },
    subtitleTileBar:{
        fontSize:10
    },
    normalFrame:{
        border: "0px",
        cursor: "pointer"
    },
    selectedFrame:{
        border: "2px solid #1e88e5",
        cursor: "pointer"
    },
    dropInputFile:{
        position: "absolute",
        margin: 0,
        padding: 0,
        width: "100%",
        height: "100%",
        outline: "none",
        opacity: 0,
        cursor: "pointer"
    },
    divider: {
        width: 1,
        height: 28,
        margin: 5,
    },
})