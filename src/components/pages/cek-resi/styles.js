export default theme=>({
    paperSearchBar: {
        padding: '0px 5px',
        margin:'0px 20px',
        display: 'flex',
        alignItems: 'center',
        width:"100%",
        boxShadow: "0px 0px 1px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -" +
            "1px rgba(0,0,0,0.12)"
        // border:"0.5px solid #c4cdd5"
    },
    root:{
        display: 'flex',
        alignItems: 'center',    
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
})