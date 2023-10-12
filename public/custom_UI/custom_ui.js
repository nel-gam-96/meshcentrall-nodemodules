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
    //const custom_navigate_btns = document.querySelectorAll('[data-type="custom"]');
    const all_leftMeu_btns = document.querySelectorAll('.lbbutton');
    all_leftMeu_btns.forEach(btn=>btn.addEventListener('click',()=>handleCustomView(btn)));
}

const addCustomReportView = async(container) => {
    const url = window.location.origin;
    try {
        const req = await fetch(`${url}/custom_report_view`);
        const data = await req.text();
        const html = new DOMParser().parseFromString(data,'text/html').body.firstChild;
        container.insertAdjacentElement('afterbegin',html);
    } catch (error) {
        console.log(error)
    }
}

const main = async() => {
    const mainTable = document.getElementById('column_l');
    await addCustomReportView(mainTable);
    setCustomHandlers();
}
window.addEventListener('DOMContentLoaded',main)