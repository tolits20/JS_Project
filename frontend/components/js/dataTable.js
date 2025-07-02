import {ip,port} from "../../config/network.js"
console.log(ip,port)
$(document).ready(function () {
    console.log('asdsad')
    $('#u-table').dataTable({
        ajax:{
            url:`http://${ip}:${port}/api/v1/admin/user-all`,
            dataSrc:"data"
        },
        buttons:[
            "pdf",
            'excel',
        ],
        columns:[
            {data:"name"},
            {data:'email'},
            { data:null,
            render:function(data,type,row){
                return `<button data-id=${data.user_id} class='btnEdit btn btn-primary'><i class='fa fa-edit'></i></button>
                <button data-id=${data.user_id} class='btnDestroy btn btn-danger'><i class='fa fa-trash'></i></button>`
            }}
        ]
    })
});