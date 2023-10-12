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

const addDinamicFunctions = () => {
    //SELECT DEL GRUPO
    const group_select = document.getElementById('c_layout_select');
    group_select.addEventListener('change',(e)=>{
        const {options} = e.target;
        Object.values(options).forEach(opt=>{
            if(opt.selected){
                const id = opt.value;
                console.log(id);
            }
        })
    })
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