var todoInput = document.getElementById("todo");
var todoList = document.getElementById("todos");

function colorChange(b){

      var refColorValue= b[0].value;
      console.log(refColorValue);
      for(let i=0;i<b.length;i++){
      localStorage.setItem('colorvalue',b[0].value)
      }
      if(refColorValue == "completed"){
        var refValue="refCompleted";
        localStorage.setItem('color',refValue)
      }
      else if(refColorValue == "Inprogress"){
        var refValue="refInProgress";
        localStorage.setItem('color',refValue)
      }
      else{
        var refValue = "refOnHold"
        localStorage.setItem('color',refValue)
      }
      window.location.reload();
}


var todoApp = {
    addTodo: function () {
        let todo = todoInput.value;
        let newTodo = {
            task: todo,
            status: false
        };

        todoService.addTodo(newTodo);
        this.appendElement(newTodo);
        pagination.render();
        pagination.gotoLastPage();

    },
    // Takes model->append to parent view
    appendElement: function (todo) {
        var itemView = this.parseHtml(this.getItemView(todo));
        todoList.appendChild(itemView);
    },

    // Takes html string->DOM element
    parseHtml: function (html) {
        var t = document.createElement('template');
        t.innerHTML = html;
        return t.content.cloneNode(true);  // explain
    },


    // Get html view of single model instance.
    getItemView: function (todoItem) {
        let html = "";
        
        let btnText = "complete";
        let btnEdit = "";
        let btnDelete = `
        <button type='button' 
            onclick='todoApp.myFunction(this,${todoItem.id})'
        class='btnr'><i class="fa fa-trash" aria-hidden="true"></i>
        </button>
        `;
        
        let todoItemStyle = "";
        let iconColor = '';
        var refValue = localStorage.getItem('color');
        let buttonUndoRedoText = "complete";
        let markValue=localStorage.getItem('Dvalue');
        
        if (todoItem.status === true) {
            todoItemStyle = "row";
            buttonUndoRedoText = "undo";
        }
        
        // Use Backtick-> found near <esc> key on most keyboards
        //onclick="todoApp.onToggleEdit(${todoItem.id})"
        //<i class="fa fa-heart-o" id="${todoItem.id}" onclick="todoApp.handleIcon(id)" aria-hidden="true"></i>
        // <select onchange='todoApp.addColor(this,${todoItem.id})'  id="b" class='form child-changed option dropdown ${todoItem.className}'   name="b">
      //   <option>Status</option>
      //   <option value="Inprogress">Inprogress</option>
      //   <option value="completed">completed</option>
      //   <option value="Onhold">Onhold</option>
      // </select>

        let btnSelect= `<input  type="checkbox" id="selectAll" value="selectall"></input>`;

        let selectedStatus= `<select name="list" id="listitems" onchange="todoApp.setStatus(this,${todoItem.id})" ; todoApp.setColor(this,${todoItem.id})'>`;
        selectedStatus+= `<option  selected>Select</option>`;
        if(todoItem.status=="completed"){
        selectedStatus+= `<option value="completed" selected>Completed</option>`;
  
       }
       else{
        selectedStatus+= `<option value="completed" >Completed</option>`;
  
       }
  
       if(todoItem.status=="in-progress"){
        selectedStatus+= `<option value="in-progress" selected>In-progress</option>`;
  
       }
       else{
        selectedStatus+= `<option value="in-progress" >In-progress</option>`;
  
       }
  
       if(todoItem.status=="on-hold"){
        selectedStatus+= `<option value="on-hold" selected>On-hold</option>`;
  
       }
       else{
        selectedStatus+= `<option value="on-hold" >On-hold</option>`;
  
       }
        selectedStatus+= `</select>`;


        let btnLike= `<button type='button' onclick='todoApp.addFav(this,${todoItem.id})' class='btn'>`;
    
        if(todoItem.isFav==false){
          btnLike+= `<i class="fa fa-heart-o" style="font-size:12px;"></i>`;
    
        }
        else{
          btnLike+= `<i class="fas fa-heart" style="font-size:12px;"></i>`;
    
        }
    
        btnLike+=`</button> `;




        btnEdit = `
        <button type='button' onclick="todoApp.onToggleEdit(${todoItem.id})"
            class='btn'><i class="fa fa-pencil" aria-hidden="true"></i>
        </button>
        `;
        
        html = `
        <li id=${todoItem.id} class='collection-item'>
         ${btnSelect}
          <a <mark class="${markValue}" >${todoItem.task}</mark></a>
             ${selectedStatus}
             ${btnEdit}
             ${btnDelete}
             ${btnLike}
        </li>
        `;
        
           if (todoItem.edit) {
            html = `
          
                <input onkeyup="todoApp.onUpdateTodo(event, ${todoItem.id})" 
                    type="text" 
                    value='${todoItem.task}' />
                    
                    
            `;
        }
        return html;
    },

    selectAll : function(todoItem)
    {
        debugger;
        var container = document.querySelector("#todos");
        var matches = container.querySelectorAll("li.collection-item>input");
        if(todoItem.checked)
        {
              for(var i=0;i<matches.length;i++){matches[i].checked=true;}
        }
        else
        {
        for(var i=0;i<matches.length;i++){matches[i].checked=false;}
        }
    },
  
    changeAll : function()
    {
      debugger;
      var mycheck = document.getElementById("myCheck");
      if(mycheck.checked){
  
        var item = document.getElementById("listitem");
        var container = document.querySelector("#todos");
        var matches = container.querySelectorAll("li.collection-item>select");
        for(var i=0;i<matches.length;i++){
          matches[i].value=item.value;
         }
         var liContainers=container.querySelectorAll("li.collection-item")
         for(var i=0;i<liContainers.length;i++)
         {
         let todo = todoApp.findTodo(liContainers[i].id);
         todo.status = item.value;
         }
  
          localStorage.setItem("todoItems", JSON.stringify( state.todos));
    }
  },
    
    all:function()
    {
      debugger;
      let dataToShow= localStorage.getItem('todoItems');
      let retrievedData= JSON.parse(dataToShow)
      state.todos=[...retrievedData];
      todoApp.render(todoService.getPagedData(1, pagination.pageLength));
      var btnToPass=document.getElementById("btn-1");
      pagination.gotoPage(btnToPass,1);
      pagination.render();
  
  
    },

    onHold: function()
    
    {
      debugger;
      let hold= localStorage.getItem('todoItems');
      let retrieved = JSON.parse(hold);
      let onhold= retrieved.filter(todo => todo.status ==="on-hold")
      state.todos=[...onhold];
      todoApp.render(todoService.getPagedData(1, pagination.pageLength));
      var btnToPass=document.getElementById("btn-1");
      pagination.gotoPage(btnToPass,1);
      pagination.render();
      
    },

  // onProgress: function()
  // {
  //   let onprogress= state.todos.filter(todo => todo.status ==="in-progress")
  //   state.todos=[...onprogress];
  //   todoApp.render(todoService.getPagedData(1, pagination.pageLength));
  //   var btnToPass=document.getElementById("btn-1");
  //   pagination.gotoPage(btnToPass,1);
  //   pagination.render();
    
  // },

  completed : function()
  {
    debugger;
    let completed= localStorage.getItem('todoItems');
    let retrieved= JSON.parse(completed)
    let com= retrieved.filter(todo=> todo.status==='completed')
    state.todos=[...com];
    // let completed= state.todos.filter(todo => todo.status === "completed")
    // state.todos=[...completed];
    todoApp.render(todoService.getPagedData(1, pagination.pageLength));
    var btnToPass=document.getElementById("btn-1");
    pagination.gotoPage(btnToPass,1);
    pagination.render();

  },

  setStatus: function(todoItem,todoId)
  {
    debugger;
    let todo = todoApp.findTodo(todoId);
      todo.status = todoItem.value;
      localStorage.setItem("todoItems", JSON.stringify( state.todos));
  },

  setColor: function(todoItem,todoId)
  {
    debugger;
    console.log(todoItem);
    console.log(todoId);
    // let todo = todoApp.findTodo(todoId);
      // todo.status = todoItem.value;
      // localStorage.setItem("todoItems", JSON.stringify( state.todos));
  },

   
    onToggleTodos: function (el, todoId) {
        //let todoId = el.parentNode.id; // Here 'el' is button.  The parent is the <li> element.
        let todo = todoService.toggleComplete(todoId);
        this.updateElement(el.parentNode, todo);
    },

    onUpdateTodo: function (event, todoId) {
        if (event.which == 27) {  // escape key
            this.toggleEdit(event.target.parentNode, todoId);
           
        } else if (event.which == 13) { //enter key
            todoService.updateTodo(todoId, event.target.value);
            this.toggleEdit(event.target.parentNode, todoId);
        }
    },

    
    

    // Render an updated fragment
    updateElement: function (el, todo) {
        el.outerHTML = this.getItemView(todo);
    },

    filterFav: function()
    {
      debugger;
      let filtered= localStorage.getItem('todoItems');
      let retrieved= JSON.parse(filtered)
      let  filters = retrieved.filter(todo => todo.isFav === true)
      state.todos=[...filters];
      todoApp.render(todoService.getPagedData(1, pagination.pageLength));
      var btnToPass=document.getElementById("btn-1");
      pagination.gotoPage(btnToPass,1);
      pagination.render();
      
    },

    

    myFunction:function(el, todoId) {
      
      var r = confirm("Are you sure that you want to delete ID:"+todoId+" permanantly?");
      if (r == true) {
        todoApp.removeTodo(el, todoId);
      } else {
        txt = "You pressed Cancel!";
      }
    },
    
    

    addColor: function(todoItem,todoId)
    {
      debugger;
      let v = todoItem.value;
      if(todoItem.value=="completed")
      {
      todoItem.className="green";
      // let todo = todoApp.findTodo(todoId);
      todoItem.dropdowncolor = 'green'; 
      localStorage.setItem("Dvalue",'green')
      }
      else if (todoItem.value=="in-progress")
      {
        todoItem.className="white";
        // let todo = todoApp.findTodo(todoId);
        todoItem.dropdowncolor = 'white';
        localStorage.setItem("Dvalue",'white')
      }
        else 
        {
          todoItem.className="orange";
          // let todo = todoApp.findTodo(todoId);
          todoItem.dropdowncolor = 'orange'; 
          localStorage.setItem("Dvalue",'orange') 
        }
  
    },
  
    addFav:function(todoItem,todoId)
    {
     
      
      if(todoItem.children[0].className=="fas fa-heart")
      {
      todoItem.children[0].className="fa fa-heart-o";
      let todo = todoApp.findTodo(todoId);
      todo.isFav = false; }
      else
      {
        todoItem.children[0].className="fas fa-heart";
        let todo = todoApp.findTodo(todoId);
        todo.isFav = true;  }
        localStorage.setItem("todoItems", JSON.stringify( state.todos));
    }
    ,


    findTodo: function (todoId) {
      let todo = state.todos.find((todo) => {
          return (todo.id == todoId);
      });
      return todo;
    },
  

   

 

  onEdit:function(todoId){
    // var editValue ="true";
    // todoApp.onToggleEdit(editValue);
    // console.log(editValue)
    onToggleEdit(todoId)
    
  },


    onToggleEdit: function (todoId) {
        // if (event.target.tagName.toLowerCase() !== "li") return;
        // let todoId = event.target.id;
        this.toggleEdit(event.target, todoId);
  
    },

    toggleEdit: function (target, todoId) {
        let todo = todoService.toggleEdit(todoId);
        // todo.edit="true";
        // console.log("edit",todo.edit)
        this.updateElement(target, todo);
    },

    toggleTodos: function (el) {
        let todoId = el.parentNode.id;

        let todos = state.todos.map((todo) => {
            if (todo.id == todoId) {
                todo.status = !todo.status;
            }
            return todo;
        });

        state.todos = [...todos];
        this.render();
    },

   
   

    removeTodo: function (el, todoId,result1) {
      
    //   confirmDialog.show();

      todoService.removeTodo(todoId);
      todoApp.removeElement(el.parentNode);
      pagination.render();
     
      pagination.gotoLastPage();
    },

    removeElement: function (el) {
        todoList.removeChild(el);
    },

    render: function (todos) {
        let html = "";
        //let todos = todoService.getAll();

        if (todos.length === 0) {
            todoList.innerHTML = "No Todos!";
            return;
        }
        for (let i = 0;i < todos.length; i++) {
            html += this.getItemView(todos[i]);
        }
        todoList.innerHTML = html;
    }
};

todoApp.render(todoService.getPagedData(1, pagination.pageLength));

class Dialog {
  constructor(elem, options={}) {
    this.elem = document.querySelector(elem);
    this.hasRendered = false;
    this.onSubscribe = this.onSubscribe.bind(this);
    
    this.options = options;
    // this.dialogStyle = options.width && `width:${options.width}`;
    // this.width = options.width || "100%";
    // // this.margintop=options.margintop ||"5px";
    // // this.paddingleft=options.paddingleft ||"2px";
    this.title = options.title || "Dialog Title";
    this.content = options.content ||  "Content goes here...";
    // this.elem.style.width = this.width;  // Assign the width to parent container
    // // this.elem.style.margintop = this.margintop; 
    // // this.elem.style.paddingleft = this.paddingleft; 
    
    this.headerStyle = this.toStyleString(options.headerStyle);
    this.bodyStyle = this.toStyleString(options.bodyStyle);
    
    this.subscribers = [];
    this.data = null;
    if (this.options.onSubscribe && typeof this.options.onSubscribe === "function") {
      this.onSubscribe(this.options.onSubscribe);
    }
  }

  
  
  onSubscribe(cb) {
    this.subscribers.push(cb);
  }
  
  notify(data){
    this.data = data;
    console.log(data);
    // console.log(this.subscribers.length);
    this.subscribers.forEach((cb) => {
      cb(data);
    });
    this.close();  
  }
 
  
  toStyleString(style) {
    let result = "";
    if (!style) return result;
    Object.keys(style).forEach((k) => {
      result += `${k}:${style[k]};`; 
    });
    console.log("style: ", result);
    return result;
  }
  
  init() {
    let dialogClose = this.elem.querySelector(".dialog-close-icon");
    dialogClose.addEventListener("click", (e)=> {  
      this.notify("ok");
      this.close();
    });
    
    let positiveButton = this.elem.querySelector("button.positive");
    positiveButton.addEventListener("click", (e)=> {  
      this.notify("ok");
      this.close();
    });
    
  }
  
  didRender() {
    this.init();
  }
  
  show() {
    if (this.hasRendered) {
       this.elem.style.display = "block";
    } else {
      this.elem.innerHTML = this.render();
      this.didRender();
    }
  }
  
  hide() {
    this.elem.style.display = "none";
  }
  
  close() {
    this.hasRendered = false;
    this.elem.parentNode.removeChild(this.elem);
    this.subscribers = [];
  }
  
  render() {
    this.hasRendered = true;
    let ui = (`
      <div class='container'>
      <div class='dialog dialog-wrapper center-align'>
         <div class='dialog-header'>
            <header>
              ${this.title}
              <span class="dialog-close-icon">❌</span>
            </header>
         </div>
         <div class='dialog-body' style='${this.bodyStyle}'>
            ${this.content}
         </div>
        <div class='dialog-buttons'>
          <button class="button positive">Ok</button>
        </div>
  
      </div>
      </div>
    `);
    return ui;
  }
}

class Notification extends Dialog {
  constructor(elem, options) {
    super(elem, options);
    this.timeout = options.timeout || 0;
    this.title = options.title || "Dialog Title";
    this.content = options.content || "Content goes here...";
  }
  
  didRender() {
    super.didRender();
    if (!this.timeout) return;
    this.timer = setTimeout(()=> {
      clearInterval(this.timer);
      this.hide();
    }, this.timeout)
  }
  
  hide() {
    this.close();
  }
  
  show() {
    this.elem.innerHTML = this.render(); 
    this.didRender();
  }
  render() {
    return super.render();
  }
  
}

class ConfirmDialog extends Dialog {
  constructor(elem, options={}) {
    super(elem, options);
  }
  
 
  
  toStyleString(style) {
    let result = "";
    if (!style) return result;
    Object.keys(style).forEach((k) => {
      result += `${k}:${style[k]};`; 
    });
    console.log("style: ", result);
    return result;
  }
  
  init() {
    let dialogClose = this.elem.querySelector(".dialog-close-icon");
    dialogClose.addEventListener("click", (e)=> {  
      this.close();
    });
     
    let positiveButton = this.elem.querySelector("button.positive");
    positiveButton.addEventListener("click", (e)=> {  
      this.notify("yes");
    });
    
    let negativeButton = this.elem.querySelector("button.negative");
    negativeButton.addEventListener("click", (e)=> {  
      this.notify("no");
    });
    
  }
  
  didRender() {
    this.init();
  }
  
  
  show() {
    if (this.hasRendered) {
       this.elem.style.display = "block";
    } else {
      this.elem.innerHTML = this.render();
      this.didRender();
    }
  }
  
  hide() {
    this.elem.style.display = "none";
  }
  
  close() {
    this.hasRendered = false;
    this.elem.parentNode.removeChild(this.elem);
  }

  
  
  render() {
    this.hasRendered = true;
    let ui = (`
      <div class='dialog dialog-wrapper' style=${this.dialogStyle}>
         <div class='dialog-header' style='${this.headerStyle}'>
            <header>
              ${this.title}
              <button class="dialog-close-icon">X</button>
            </header>
         </div>
         <div class='dialog-body' style='${this.bodyStyle}'>
            ${this.content}
         </div>
        <div class='dialog-buttons'>
          <button class="button positive" onclick="accept()" >Delete</button>
          <button class=" button negative" onclick="reject()" >Cancel</button>
        </div>
  
      </div>
    `);
    return ui;
  }
}


function accept(){
  // localStorage.setItem('a','yes');
  sessionStorage.setItem("a", "yes");
  
}

function reject(){
  // this.result = "no";
  sessionStorage.setItem("a", "no");
}




let confirmDialog = new ConfirmDialog("#dialog",{
  width: "400px",
  paddingleft: "50px",
  margintop: "38px",

  title: "Delete Todo",
  content: "Are you sure?",
  onSubscribe: (result) => {
    // var a = result;
    // alert(result);
    // localStorage.setItem('a',result)
  }
});

