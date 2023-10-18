const handleCustomView = (custom_element) => {
    if(('type' in custom_element.dataset) == false || custom_element.dataset.type != 'custom'){
        const custom_views = document.querySelectorAll('[data-view="custom"]');
        custom_views.forEach(el=>el.style.display = 'none');
        return;
    };
    const views = document.getElementById('column_l').children;
    Object.values(views).forEach(el=>el.style.display = 'none');
    const {view} = custom_element.dataset;
    const custom_view = document.getElementById(`c_view_${view}`);
    custom_view.style = '';
}   

const setCustomHandlers = () => {
    const all_leftMeu_btns = document.querySelectorAll('.lbbutton');
    all_leftMeu_btns.forEach(btn=>btn.addEventListener('click',()=>handleCustomView(btn)));
}

const getAllInputsChecked = () => {
    let input_checkeds_ids = [];
    let total_input_chekeds = 0;
    const mesh_inputs = document.querySelectorAll('#c_layout_aside input[name=mesh_input]');
    const main_input_check_all = document.getElementById('main_all_check_input')
    const mesh_inputs_num = mesh_inputs.length;
    mesh_inputs.forEach(mi=>{
        if(mi.checked){
            input_checkeds_ids.push(mi);
            total_input_chekeds+=1;
        }
    });
    if(total_input_chekeds == mesh_inputs_num){
        main_input_check_all.checked = true;
    }else{
        main_input_check_all.checked = false;
    }
    return input_checkeds_ids
}

const getGroups = async (mesh_ids = []) => {
    const url = window.location.origin;
    try {
        const res = await fetch(`${url}/groups`,{
            method:'POST',
            body:JSON.stringify({mesh_ids}),
            headers: {
                "Content-Type": "application/json",
            }
        })
        const data = await res.json();
        return data.meshs;
    } catch (error) {
        console.log(error)
        return null
    }
}

const handleCheckBoxCheck = async (check_element) => {
    const epad_select = document.getElementById('c_layout_select'); 
    if(check_element.value == 'ALL'){
        const mesh_inputs = document.querySelectorAll('#c_layout_aside input[name=mesh_input]')
        mesh_inputs.forEach(mi=>mi.checked = check_element.checked);
    }
    const groups_checked = getAllInputsChecked();
    const ids_checkeds = groups_checked.map(gc=>gc.value);
    const groups = await getGroups(ids_checkeds);
    if(groups.length == 0){
        epad_select.innerHTML = '<option value="0">-</option>';
        epad_select.disabled = true;
        return;
    }
    let nodes = [];
    groups.forEach(g=>{
        nodes = [...nodes,...g.nodes];
    })
    let html_options = '<option value="ALL"> Todos </option>';
    nodes.forEach(n=>{
        const option = `<option data-host="${n.host}" data-ip="${n.ip}" value="${n._id}"> ${n.name} </option>`;
        html_options += option;
    });
    epad_select.innerHTML = html_options;
    epad_select.disabled = false;
}

const addDinamicFunctions = () => {
    // MAIN INPUT CHECK
    const main_input_check = document.getElementById('main_all_check_input');
    main_input_check.addEventListener('click',()=>handleCheckBoxCheck(main_input_check));

    //INPUTS CHECKS
    const mesh_inputs = document.querySelectorAll('#c_layout_aside input[name=mesh_input]');
    mesh_inputs.forEach(mi=>mi.addEventListener('click',()=>handleCheckBoxCheck(mi)))
}

const addCustomReportView = async(container) => {
    const url = window.location.origin;
    try {
        const req = await fetch(`${url}/custom_report_view`);
        const data = await req.text();
        const html = new DOMParser().parseFromString(data,'text/html').body.firstChild;
        container.insertAdjacentElement('afterbegin',html);
        addDinamicFunctions();
    } catch (error) {
        console.log(error)
    }
}

const getApiToken = async () => {
    try {
        let token = window.localStorage.getItem('__token__');
        if(!token){
            const res = await fetch('/getApiToken',{
                method:'POST'
            });
            const data = await res.json();
            token = data.data;
            console.log(token.data);
            window.localStorage.setItem('__token__',token.data);
        }
        return token;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const handleSubmit = async (formElement) => {
    return
    const token = await getApiToken();
    if(!token) return window.alert('Error al obtener token de API');
    const form = new FormData(formElement);
    //const node = form.get('c_layout_select');
    const start_date = form.get('start_date');
    const end_date = form.get('end_date');
    const body = {
        page:1,
        pagination:300,
        start_date,
        end_date,
        __token__:token
    }
    const res = await fetch('/resourceList',{
        method:'POST',
        body:JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        }
    });
    const data = await res.text();
    const table_container = document.getElementById('c_layout_content');
    table_container.innerHTML = data;
}


const main = async() => {
    const mainTable = document.getElementById('column_l');
    await addCustomReportView(mainTable);
    setCustomHandlers();
    const search_devices_form = document.getElementById('c_layout_filters');
    search_devices_form.addEventListener('submit',(e)=>{
        e.preventDefault();
        handleSubmit(search_devices_form);
    });
    await getApiToken();
}
window.addEventListener('DOMContentLoaded',main)