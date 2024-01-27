
const underline = document.querySelector('#underline')

const tabs = document.querySelectorAll('.tab')
const todoList=[];
const ingList=[];
const doneList=[];
const input = document.querySelector('input')
const addButton = document.querySelector('#add')

tabs.forEach( tab=> 
    tab.addEventListener('click', (e)=>
     indicator(e)));

function indicator(e){
    console.log(e.currentTarget)    
    // 이전에 bold로 설정된 탭에서 bold 클래스를 제거합니다.
    if(document.querySelector('.bold')){
        document.querySelector('.bold').classList.remove('bold');
    }
    
    // 현재 클릭된 탭에 bold 클래스를 추가하여 볼드체로 설정합니다.
    e.currentTarget.classList.add('bold');

    underline.style.borderRadius = '10px';

    underline.style.left = e.currentTarget.offsetLeft + 'px';
    console.log(underline.style.left);

    underline.style.top = e.currentTarget.offsetTop  + 'px';
    console.log(underline.style.top);

    underline.style.width = e.currentTarget.offsetWidth  + 'px';

    // 해당 탭의 List를 보여주기
    if(e.currentTarget.classList.contains('all')){ 
        // e.currentTarget.class =='all'로 하면 오류
        // e.currentTarget.class.includes('all')도 오류
        // e.currentTarget.classList.includes('all')해도 오류
        // 그 이유는 DOMTokenList는 '배열유사객체' contains()로 접근해야 된다.
        renderList();
    } else if(e.currentTarget.classList.contains('ing')){
        renderSpecificList(ingList);
    } else if(e.currentTarget.classList.contains('done')){
        renderSpecificList(doneList)
    }    
}




// 유저가 값을 입력한다.
// + 버튼을 클릭하면, 할 일이 추가된다. (기존 진행중으로 등록됨)
// delete버튼을 클릭하면, 할일이 삭제된다.
// check버튼을 클릭하면, 할일에 밑줄이 가고, 완료으로 변화된다.
//(만약 다시 check버튼을 누르면, 밑줄이 사라지고, 진행중으로 변한다)
//'진행중', '완료' 탭을 누르면, 언더바(음영)가 이동한다.
// 완료 탭은 끝난 아이템만, 진행중 탭은 진행중인 아이템만 보여준다.
// 전체 탭을 누르면 다시 전체 아이템으로 돌아온다.

//1. 유저 값 입력을 받아오기. input태그, 버튼 태그를 받아옴




addButton.addEventListener('click', getTodo)
input.addEventListener('keyup', function(e){
    if(e.key =='Enter'){
        let item = {value: input.value, class: ''}
        todoList.push(item)
        ingList.push(item) // 여기에도 넣는다.       
        input.value=''
        renderList()
    }    
})

function getTodo(){
    let item = {value: input.value, class: ''}
    todoList.push(item)
    ingList.push(item) // 여기에도 넣는다.   
    input.value=''
    renderList()
}

const task = document.querySelector('.task')

function renderList(){
     // 기존 ul 태그를 제거
    const existingUlTag = task.querySelector('ul');
    if (existingUlTag) {
        existingUlTag.remove();
        //혹은 task.removeChild(existingUlTag)
    }

    // 새로운 ul 태그 생성
    const ulTag = document.createElement('ul');
    ulTag.style.paddingLeft ='0px';
    //확실하게 다시한번 task 초기화(비워둔다)
    task.innerHTML ='';

    todoList.forEach( (todo) =>{
        const liTag = document.createElement('li');
        liTag.classList.add('todos');
        if (todo.class =='completed'){
            liTag.classList.add('completed');
            console.log(`${todo.value} tag에 completed 추가됨`)
        }        
        liTag.setAttribute('data-key', todo.value);
        console.log(liTag)
        liTag.innerHTML =`
            <div class="todo ${todo.class}">${todo.value}</div>
            <div>
                <button class="check">완료</button>
                <button class="delete">삭제</button>
            </div>
        `;
        // liTag에도 이벤트리스너를 달아서, check 반응하게만든다.
        liTag.addEventListener('click', handleCheckButtonClick);[]
        ulTag.appendChild(liTag);  
        
    });

    //생성된 ul을 task 영역에 추가
    task.appendChild(ulTag);    

    // 버튼들에 이벤트 리스너 연결
    const checkButtons = document.querySelectorAll('.check');
    const deleteButtons = document.querySelectorAll('.delete');

    checkButtons.forEach(checkButton => {
        checkButton.addEventListener('click', handleCheckButtonClick);
    });

    deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener('click', handleDeleteButtonClick);
    });
}

// Check 버튼 클릭 시 처리
function handleCheckButtonClick(e) {
    const button = e.currentTarget;
    const liTag = button.closest('li');
    const key = liTag.getAttribute('data-key');
    console.log("key: ", key)
    let todoIndex; 
    let ingIndex;
    //
    // todoList에서 해당 key 값을 가진 객체를 찾습니다.
    const targetTodo = todoList.find(todo => todo.value === key);
    
    if(targetTodo){
        targetTodo.class ='completed';
        todoIndex = todoList.indexOf(targetTodo);
        ingIndex = ingList.indexOf(targetTodo);
        console.log("todoIndex", todoIndex)
    }
    
    if(todoIndex != -1){
        //중복해서 들어가지 않도록
        if (doneList.find(todo=> todo.value == key)) return;

        doneList.push(targetTodo);       
    }
    if(ingIndex != -1){
        ingList.splice(ingIndex, 1)
    }

    renderList();
}



// Delete 버튼 클릭 시 처리
function handleDeleteButtonClick(e) {
    const button = e.currentTarget;
    const liTag = button.closest('li');
    const key = liTag.getAttribute('data-key');  
    let todoIndex;
    let ingIndex;
    let doneIndex;

    // todoList에서 해당 key 값을 가진 객체를 찾습니다.
    const targetTodo = todoList.find(todo => todo.value === key);

    if(targetTodo){
        todoIndex = todoList.indexOf(targetTodo);
        ingIndex = ingList.indexOf(targetTodo);
        doneIndex = doneList.indexOf(targetTodo);
    }

    if(todoIndex != -1){
        todoList.splice(todoIndex, 1);        
    }  
    if (ingIndex != -1){        
        ingList.splice(ingIndex,1);        
    }    
    if (doneIndex != -1){        
        doneList.splice(doneIndex,1);        
    }    

    renderList();
}



function renderSpecificList(list){
    const existingUlTag = task.querySelector('ul');
    if (existingUlTag) {
        existingUlTag.remove();
    }

    const ulTag = document.createElement('ul');
    ulTag.style.paddingLeft ='0px';
    task.innerHTML ='';

    list.forEach( (todo) =>{
        const liTag = document.createElement('li');
        liTag.classList.add('todos');
        if (todo.class =='completed'){
            liTag.classList.add('completed');
            console.log(`${todo.value} tag에 completed 추가됨`)
        }        
        liTag.setAttribute('data-key', todo.value);
        console.log(liTag)
        // 버튼들은 삭제해서 안 만든다.  
        liTag.innerHTML =`
            <div class="todo ${todo.class}">${todo.value}</div>
        `;
        ulTag.appendChild(liTag);  
        
    });
    task.appendChild(ulTag);    
}
