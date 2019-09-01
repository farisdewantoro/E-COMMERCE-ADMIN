export default theme =>({
    wrapperCard:{
        display:'flex',
        justifyContent:'space-between'
    },


    spacer: {
        flex: '1 1 100%'
    },
    actions: {
        color: theme.palette.text.secondary
    },
    title: {
        flex: '0 0 auto'
    },
    paperSearchBar: {
        padding: '0px 5px',
        display: 'flex',
        alignItems: 'center',

        boxShadow: "0px 0px 1px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -" +
            "1px rgba(0,0,0,0.12)"
        // border:"0.5px solid #c4cdd5"
    },
    input: {
        marginLeft: 8,
       
    },
    iconButton: {
        padding: 10
    },
    divider: {
        width: 1,
        height: 40,

    },
    buttonFilter: {
        padding: "5px",
        fontSize: " 0.875rem",
        textTransform: "none",
        fontWeight: 400
    },
    paperSelectedProduct: {
        display: 'flex',
        alignItems: 'center',
        border: "0.5px solid #c4cdd5"
    },
    dividerProductSelected: {
        width: 1,
        height: 30,
        backgroundColor: "#c4cdd5"
    },
    textSelected: {
        background: "#f4f6f8",
        color: "#919eab",
        padding: "4px 8px",
    },
    p8: {
        padding: "4px 8px"
    },
    buttonSelected: {
        fontSize: " 0.875rem",
        padding: "4px 8px",
        textTransform: "none",
        fontWeight: 400,

    },
    menuListText: {
        fontSize: " 0.875rem",
    }
})