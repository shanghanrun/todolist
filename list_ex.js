item ={value:'1', class:'normal'};
item2 ={value:'2', class: 'normal'};

todoList = []
ingList = []

todoList.push(item);
ingList.push(item);

todoList.push(item2);
console.log('todoList: ', todoList);
ingList.push(item2);
console.log('ingList: ', ingList);

todoList.pop()
console.log(todoList);
console.log(ingList);

key ='1'
todoList = todoList.filter(todo => todo.value != key)
ingList = todoList.filter(todo => todo.value != key)
console.log(todoList);
console.log(ingList);
