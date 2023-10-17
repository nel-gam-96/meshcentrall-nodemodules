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
        main_input_check_all.disabled = true;
    }else{
        main_input_check_all.disabled = false;
    }

    return input_checkeds_ids
}

const handleCheckBoxCheck = (check_element) => {
    const groups_checked = getAllInputsChecked();
    console.log(groups_checked)
    //console.log(check_element.checked)
}

const addDinamicFunctions = () => {
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

const main = async() => {
    const mainTable = document.getElementById('column_l');
    await addCustomReportView(mainTable);
    setCustomHandlers();

    // const res = await fetch('/getApiToken',{
    //     method:'POST'
    // });
    // const data = await res.json();
    // console.log(data);

}
window.addEventListener('DOMContentLoaded',main)