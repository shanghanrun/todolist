const underline = document.querySelector('#underline')

const tabs = document.querySelectorAll('.tab')
let todoList=[];
let ingList=[];
let doneList=[];
let checked = true;
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
    // console.log(underline.style.left);

    underline.style.top = e.currentTarget.offsetTop  + 'px';
    // console.log(underline.style.top);

    underline.style.width = e.currentTarget.offsetWidth  + 'px';

    // 해당 탭의 List를 보여주기
    if(e.currentTarget.id == 'all'){ 
        // e.currentTarget.class =='all'로 하면 오류
        // e.currentTarget.class.includes('all')도 오류
        // e.currentTarget.classList.includes('all')해도 오류
        // 그 이유는 DOMTokenList는 '배열유사객체' contains()로 접근해야 된다.
        //그런데, class보다 id로 확실하게 분리하기로 했다.
        
        renderList();
    } else if(e.currentTarget.id == 'ing'){
        renderSpecificList('ingList');  //문자열을 인자로 보낸다.
    } else if(e.currentTarget.id == 'done'){
        renderSpecificList('doneList')
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
        const inputValue = input.value.trim(); 
        // 좌우 불필요한 공백문자열 제거
        const item = {value: inputValue, class: 'normal'}

        //이미 존재하는 동일한 값이 들어오면 return으로 하면...
        //이벤트리스너는 함수가 아니라서.. 이상하고
        // 차라리 이미 존재하지 않는 값이 들어왔을 경우로 한다.
        const i = todoList.findIndex(todo => todo.value == input.value );
        if (inputValue != ''){
            // 한글로 된 문자열을 처음에 입력할 때, 이상하게도 
            // 빈문자열이 입력되고 엔터를 친 것처럼 빈 요소가 추가된다.
            // 이것을 방지하기 위해

            if (i == -1){  // 해당 인덱스 값이 존재하지 않으면 추가
                todoList.push({...item})  //객체 독립
                ingList.push({...item}) // 여기에도 넣는다.       
                input.value=''
                renderList()
            }
        }
    }    
})

function getTodo(){
    const inputValue = input.value.trim(); 
    let item = {value: inputValue, class: 'normal'}
    // class값을 null로 하지 않고 넣어준다.
    const i = todoList.findIndex(todo => todo.value == input.value );
    if (inputValue != ''){
        if (i == -1){ // 해당 인덱스 값이 존재하지 않으면 추가
            todoList.push({...item})
            ingList.push({...item})       
            input.value=''
            renderList()
        }
    }
}

const task = document.querySelector('.task')

function renderList(){
     // 기존 ul 태그를 제거
    const existingUlTag = task.querySelector('ul');
    task.innerHTML ='';
    // if (existingUlTag) {
    //     existingUlTag.remove();
    //     //혹은 task.removeChild(existingUlTag)
    // }

    // 새로운 ul 태그 생성
    const ulTag = document.createElement('ul');
    ulTag.style.paddingLeft ='0px';
    //확실하게 다시한번 task 초기화(비워둔다)
    

    todoList.forEach( (todo) =>{
        const liTag = document.createElement('li');
        liTag.classList.add('todo');
        if (todo.class =='completed'){
            liTag.classList.add('completed');
        }        
        liTag.setAttribute('data-key', todo.value);
        // console.log(liTag)
        liTag.innerHTML =`
            <div class="item ${todo.class}">${todo.value}</div>
            <div>
                <button class="check">완료</button>
                <button class="delete">삭제</button>
            </div>
        `;
        // liTag에도 이벤트리스너를 달아서, check 반응하게만든다.
        // liTag.addEventListener('click', handleCheckButtonClick);
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

    console.log('todoList: ', todoList);
    console.log('ingList: ', ingList);
    console.log('doneList: ', doneList);
}

// Check 버튼 클릭 시 처리
function handleCheckButtonClick(e) {
    const currentButton = e.currentTarget;
    const currentLiTag = currentButton.closest('li');
    const currentDiv = currentLiTag.querySelector('div')
    console.log(currentDiv)
    const key = currentLiTag.getAttribute('data-key');
    console.log("key: ", key)
    let todoIndex; 
    let ingIndex;
    //
    // todoList에서 해당 key 값을 가진 객체를 찾는다.
    const targetTodo = todoList.find(todo => todo.value == key);
    todoIndex = todoList.findIndex(todo => todo.value ==key);
    ingIndex = ingList.findIndex(todo => todo.value == key);
    // findIndex메소드는 없으면 -1을 반환한다.


    //이미 완료로 된 상태에서 다시 눌렸을 경우
    if( targetTodo.class == 'completed'){
        currentLiTag.classList.remove('completed');
        currentDiv.classList.remove('completed');
        targetTodo.class = 'normal';
        doneList = doneList.filter(todo => todo.value != key)
        ingList.push(targetTodo)
        return;
    }


    if(todoIndex != -1){
        targetTodo.class ='completed';

        // check를 여러번 누를 때, done에 중복되어 들어가지 않도록
        // done에 동일한 값이 없을 때만 추가하도록 
        if (!doneList.some(todo=> todo.value == key)){
            doneList.push({...targetTodo}); //객체 독립 
        } 
    }
    if(ingIndex != -1){  // 리스트안에 요소가 있을 때 삭제 메소드사용
        ingList.splice(ingIndex, 1)
    }

    renderList(checked);
}


// Delete 버튼 클릭 시 처리
function handleDeleteButtonClick(e) {
    const button = e.currentTarget;
    const liTag = button.closest('li');
    const key = liTag.getAttribute('data-key'); 
     
    let todoIndex;
    let ingIndex;
    let doneIndex;

    // todoList에서 해당 key 값을 가진 객체를 찾는다
    const targetTodo = todoList.find(todo => todo.value == key);
    console.log('delete 키가 눌림')
    console.log('key : ', key) // 1
    console.log('삭제되는 아이템의 객체: ', targetTodo ) //{해당객체}
    console.log('삭제되는 아이템의 value', targetTodo.value) // 1

    // 객체형태의 요소를 담은 리스트의 경우, 객체요소를 제거하려면
    // 인덱스로 접근하면 안되고, filter함수로 접근해야 된다.

    if(targetTodo){  // 삭제되는 객체가 존재하면
        
        ingList = ingList.filter( todo => todo.value != key)
        doneList = doneList.filter( todo => todo.value != key)
        // key값은 liTag로 부터 받아오고, liTag는 todoList로부터 
        // 만들어진다. 그래서 todoList의 요소부터 지워버리면,
        // 어떤 liTag는 key값을 받지 못하게 된다. 
        //그래서 null인 키값으로 filter를 하니, 빈값이 나올 수 있다.
        //그래서 todoList filter를 맨마지막에 해서, 언전하게 한다.
        todoList = todoList.filter( todo => todo.value != key)
        // list.filter로 된 겻은 새로운 배열을 반환하는 것이고,
        // 기존 배열을 변화시키는 것이 아니다.

        //아니면 위에서 처럼, findIndex하고, splice로 삭제해도 된다.
    }
    console.log(`${key} 삭제된 후.....`)
    console.log('todoList: ', todoList)
    console.log('ingList: ', ingList)
    console.log('doneList: ', doneList)

    renderList()
}


function renderSpecificList(type){
    let list;
    if(type == 'ingList'){
        list = ingList;  //최신의 ingList 자료를 넘겨준다.
        console.log('ingList: ', list)
    }
    if(type == 'doneList'){
        list = doneList;
        console.log('doneList: ', list)
    }
    
    const existingUlTag = task.querySelector('ul');
    if (existingUlTag) {
        existingUlTag.remove();
    }

    const ulTag = document.createElement('ul');
    ulTag.style.paddingLeft ='0px';
    task.innerHTML ='';

    if(list.length >0){
        list.forEach( (todo) =>{
            const liTag = document.createElement('li');
            liTag.classList.add('todo'); 
            if (todo.class =='completed'){
            liTag.classList.add('completed');
            }
            // 버튼들은 안 만든다.  
            liTag.innerHTML =`
                <div class="item ${todo.class}">${todo.value}</div>
            `;
            ulTag.appendChild(liTag);  
            
        });
    }
    task.appendChild(ulTag);    
}
