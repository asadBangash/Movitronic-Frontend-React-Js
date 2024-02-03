const _ = require("lodash");

const Reducer = (state, payload) => {
    console.log("Reducer here")
    let userObj = _.isEmpty(localStorage.getItem('SESSION')) ? '' : localStorage.getItem('SESSION');
    switch (payload.type) {
        case 'SET_STATE':
            return {
                ...state,
                data: typeof payload.response == "undefined" ? [] : payload.response,
                user: typeof payload.user == "undefined" ? userObj : payload.user,
                advanceSearch:payload.advanceSearch ? true : false,
            }
        default:
            return state;
    }
};
export default Reducer;



