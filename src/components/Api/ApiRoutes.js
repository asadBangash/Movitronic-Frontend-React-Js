
let baseUrl =  'https://dev.movitronic.com/api';

module.exports = {
   
    SignUpStep1: {
        'method': 'POST',
        'url': baseUrl + '/register'
    },
    SignUpStep2: {
        'method': 'POST',
        'url': baseUrl + '/confirm/code'
    },
    Login: {
        'method': 'POST',
        'url': baseUrl + '/login'
    },
    ForgotPassword: {
        'method': 'POST',
        'url': baseUrl + '/password/forgot'
    },
    PasswordReset: {
        'method': 'POST',
        'url': baseUrl + '/password/reset'
    },
    PasswordChange: {
        'method': 'POST',
        'url': baseUrl + '/user/password/change'
    },
   ResendOTP: {
        'method': 'POST',
        'url': baseUrl + '/resend/otp'
    },
    
    VehicleListAPI:{
        'method' : 'GET',
        url: baseUrl + '/vehicles',
    },
    AllVehicleListAPI:{
        'method' : 'GET',
        url: baseUrl + '/vehicles/all',
    },
    UserDetailAPI:{
        'method' : 'GET',
        url: baseUrl + '/user/get-user-detail',
    },
    KeyRegnAPI:{
        'method' : 'POST',
        url: baseUrl + '/key/regenerate',
    },
    DeviceListAPI:{
        'method' : 'GET',
        url: baseUrl + '/serial',
    },
    DeviceAddAPI:{
        'method' : 'POST',
        url: baseUrl + '/serial/create',
    },
    DeviceUpdateAPI:{
        'method' : 'POST',
        url: baseUrl + '/serial/update/',
    },

    DeviceEditAPI:{
        'method' : 'GET',
        url: baseUrl + '/serial/get/',
    },
    DeviceDeleteAPI:{
        'method' : 'DELETE',
        url: baseUrl + '/serial/delete/',
    },
    SoftwareListAPI:{
        'method' : 'GET',
        url: baseUrl + '/device/fw/',
    },
    SoftwareAddAPI:{
        'method' : 'POST',
        url: baseUrl + '/device/fw/upload',
    },

    SoftwareDeleteAPI:{
        'method' : 'DELETE',
        url: baseUrl + '/device/fw/delete/',
    },
    EditSoftwareAPI:{
        'method' : 'GET',
        url: baseUrl + '/device/fw/get/',
    },
    UpdateSoftwareAPI:{
        'method' : 'POST',
        url: baseUrl + '/device/fw/update/',
    },
    UpdateSoftwaree:{
        'method' : 'POST',
        url: baseUrl + '/event/update/software',
    },
    CurrentUserAPI:{
        'method' : 'GET',
        url: baseUrl + '/user',
    },

    AddVehicleAPI:{
        'method' : 'POST',
        url: baseUrl + '/vehicles/create',
    },

    AddUser:{
        'method' : 'POST',
        url: baseUrl + '/user/create',
    },

    UserListAPI:{
        'method' : 'GET',
        url: baseUrl + '/user/all',
    },
    
    OperatorListAPI:{
        'method' : 'GET',
        url: baseUrl + '/admin/all',
    },
    MyOperatorListAPI:{
        'method' : 'GET',
        url: baseUrl + '/admin/',
    },
    VerifyUser:{
        'method' : 'POST',
        url: baseUrl + '/user/userdetails',
    },
    AddShareAPI:{
        'method' : 'POST',
        url: baseUrl + '/shares/create',
    },
    GetVehicles:{
        'method' : 'GET',
        url: baseUrl + '/shares/getBothVehicle',
    },
    ShareListAPI:{
        'method' : 'GET',
        url: baseUrl + '/shares',
    },
    ShareMyListAPI:{
        'method' : 'GET',
        url: baseUrl + '/shares/myshares',
    },
    MySharesWithMeAPI:{
        'method' : 'GET',
        url: baseUrl + '/shares/sharedwithme',
    },
    AddOperator:{
        'method' : 'POST',
        url: baseUrl + '/admin/create',
    },
    
    EditVehicle:{
        'method' : 'GET',
        url: baseUrl + '/vehicles/get/',
    },
    
    VehicleMakeList:{
        'method' : 'GET',
        url: baseUrl + '/vehicle_company',
    },
    VehicleModelList:{
        'method' : 'GET',
        url: baseUrl + '/vehicle_model?',
    },
    VehicleModelListingName:{
        'method' : 'GET',
        url: baseUrl + '/vehicle_model',
    },
    UsageListAPI:{
        'method' : 'GET',
        url: baseUrl + '/usage/list',
    },
    UsageListMyAPI:{
        'method' : 'GET',
        url: baseUrl + '/usage/own',
    },
    alldeleteUsage:{
        'method' : 'POST',
        url: baseUrl + '/usage/deleteall/',
    },

    deleteUsage:{
        'method' : 'DELETE',
        url: baseUrl + '/usage/delete/',
    },


    
    UsageDetailAPI:{
        'method' : 'GET',
        url: baseUrl + '/usage/get/data',
    },
    SearchApi:{
        'method' : 'POST',
        url: baseUrl + '/vehicles/search',
    },
    KeyModelList:{
        'method' : 'GET',
        url: baseUrl + '/vehicle_key?',
    },
    KeyModelListing:{
        'method' : 'GET',
        url: baseUrl + '/vehicle_key',
    },
    UserPermissions:{
        'method' : 'GET',
        url: baseUrl + '/user/permissions/list',
    },
    HardwareList:{
        'method' : 'GET',
        url: baseUrl + '/device/fw/hardwares',
    },
    AddVehicleCompanyAPI:{
        'method' : 'POST',
        url: baseUrl + '/vehicle_company/create',
    },
    DeleteVehicleAPI:{
        'method' : 'DELETE',
        url: baseUrl + '/vehicle_company/delete/',
    },
    
    DeleteVehicleModelListingAPI:{
        'method' : 'DELETE',
        url: baseUrl + '/vehicle_model/delete/',
    },

    DeleteVehicleKeyAPI:{
        'method' : 'DELETE',
        url: baseUrl + '/vehicle_key/delete/',
    },
 
     
    AddVehicleModelAPI:{
        'method' : 'POST',
        url: baseUrl + '/vehicle_model/create',
    },

    AddVehicleKeyAPI:{
        'method' : 'POST',
        url: baseUrl + '/vehicle_key/create',
    },
    EditAdminAPI:{
        'method' : 'GET',
        url: baseUrl + '/admin/get/',
    },
   
    UpdateAdminAPI:{
        'method' : 'POST',
        url: baseUrl + '/admin/update',
    },
    EditUserAPI:{
        'method' : 'GET',
        url: baseUrl + '/user/get/',
    },
    EditCompanyAPI:{
        'method' : 'POST',
        url: baseUrl + '/vehicle_company/get/',

    },
    EditModelAPI:{
        'method' : 'POST',
        url: baseUrl + '/vehicle_model/get/',

    },

    EditKeyAPI:{
        'method' : 'POST',
        url: baseUrl + '/vehicle_key/get/',

    },
  UpdateCompanyAPI:{
        'method' : 'POST',
        url: baseUrl + '/vehicle_company/update/',

    },

    UpdateModelAPI:{
        'method' : 'POST',
        url: baseUrl + '/vehicle_model/update/',

    },

    UpdateKeyAPI:{
        'method' : 'POST',
        url: baseUrl + '/vehicle_key/update/',

    },

    UpdateUserAPI:{
        'method' : 'POST',
        url: baseUrl + '/user/update',
    },
    deleteVehicle:{
        'method' : 'DELETE',
        url: baseUrl + '/vehicles/delete/',
    },
    deleteShare:{
        'method' : 'DELETE',
        url: baseUrl + '/shares/delete/',
    },
    // alldeleteUser:{
    //     'method' : 'POST',
    //     url: baseUrl + '/user/deleteall',
    // },
    alldeleteVechile:{
        'method' : 'POST',
        url: baseUrl + '/vehicles/deleteAll',
    },
    alldeleteUser:{
        'method' : 'POST',
        url: baseUrl + '/user/deleteall',
    },
    alldeleteAdmin:{
        'method' : 'POST',
        url: baseUrl + '/admin/delete/all',
    },
    alldeleteShare:{
        'method' : 'POST',
        url: baseUrl + '/share/deleteall',
    },
    deleteUser:{
        'method' : 'DELETE',
        url: baseUrl + '/user/delete/',
    },
    deleteAdmin:{
        'method' : 'DELETE',
        url: baseUrl + '/admin/delete/',
    },
    UpdateVehicleApI:{
        'method' : 'POST',
        url: baseUrl + '/vehicles/update/',
    },
    

    UpdateDetailsApI:{
        'method' : 'POST',
        url: baseUrl + '/user/profile/update',
    },
    UpdateEmailApI:{
        'method' : 'POST',
        url: baseUrl + '/user/email-update',
    },
    VerifyEmailApI:{
        'method' : 'POST',
        url: baseUrl + '/user/verify-code',
    },
    VerifyUserEmailApI:{
        'method' : 'POST',
        url: baseUrl + '/verify/login/otp',
    },
    VerifyPhoneApI:{
        'method' : 'POST',
        url: baseUrl + '/user/number/add',
    },
    ShareEditApI:{
        'method' : 'GET',
        url: baseUrl + '/shares/get/',
    },
    UpdateShareAPI:{
        'method' : 'POST',
        url: baseUrl + '/shares/update/',
    },
    InvitationAPI:{
        'method' : 'POST',
        url: baseUrl + '/generate-link',
    },
    
    AddWhitelabelListing:{
        'method' : 'GET',
        url: baseUrl + '/whitelabel',
    },

    SearchListAPI:{
        'method' : 'POST',
        url: baseUrl + '/whitelabel/search',
    },

    Addwhitelabeltovechile:{
        'method' : 'POST',
        url: baseUrl + '/vehicles/add/label',
       
    },
    
    Updatewhitelabeltovechile:{
        'method' : 'POST',
        url: baseUrl + '/whitelabel/remove/',
       
    },

    Sharewhitelabeltovechile:{
        'method' : 'POST',
        url: baseUrl + '/whitelabel/share/',
       
    },
   

    
    AddWhitelabel:{
        'method' : 'POST',
        url: baseUrl + '/whitelabel/create',
    },
    

    EditWhitelabelListing:{
        'method' : 'POST',
        url: baseUrl + '/whitelabel/get/',
    },

    UpdateWhitelabelListing:{
        'method' : 'POST',
        url: baseUrl + '/whitelabel/update/',
    },
    
   AllDeleteWhitelabelListing:{
        'method' : 'POST',
        url: baseUrl + '/whitelabel/deleteAll',
        
    },
    
    DeleteWhitelabelListing:{
        'method' : 'DELETE',
        url: baseUrl + '/whitelabel/delete/',
    },
    
    
    






  
    
}