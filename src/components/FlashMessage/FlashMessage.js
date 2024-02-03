import React from 'react';

function FlashMessage({isError, errors, isSuccess, success})
{
        var msgStyle;
        const renderMessage = () => {
            if(isError)
            {
                msgStyle = (isError) ? {display: 'block'} : {display:'none'};
                var html = '';
                for (var key in errors) {
                    if (errors.hasOwnProperty(key)) {
                        html += '<li>' + errors[key] + '</li>';
                    }
                }
                return html
            }
            else{
                msgStyle = (isSuccess) ? {display: 'block'} : {display:'none'};
                var html = success;
                return html
            }
        };
        return(
            <div dangerouslySetInnerHTML={{ __html: renderMessage() }} className={`alert ${isSuccess ? "alert-success" : "alert-danger"}`} style={msgStyle}>
            </div>
        )   
}
export default FlashMessage