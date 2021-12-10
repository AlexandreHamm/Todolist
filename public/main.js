// SELECTOR JQUERY STYLE

let $ = function (selector) {
    return document.querySelector(selector);
};

// NAVBAR ANIMATION

$('.navbar').addEventListener('mouseenter', function(){
    $('.navbar').style.width = '130px';
    $('.container').style.width = 'calc(100% - 130px)';
});
$('.navbar').addEventListener('mouseleave', function(){
    $('.navbar').style.width = '50px';
    $('.container').style.width = 'calc(100% - 50px)';
});

// NEW TASK TO PROJECT

document.querySelectorAll('.container__body__wrapper__project').forEach(function(article){
    article.children[1].addEventListener('click', function(){
        article.innerHTML += '<form class="task" action="/newtask" method="POST"><input name="task" type="text" class="container__body__project__task input"><input name="prjctID" type="text" value="'+article.id+'" class="hidden"></form>';
        setTimeout(function(){
            article.querySelector('input').focus();
        }, 100);
        article.querySelector('input').addEventListener('blur', function(){
            article.querySelector('form').remove();
        });
        article.querySelector('input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                
                let taskName = document.querySelector('input[name=task]').value

                fetch('/newtask', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            task: taskName,
                            prjctID: article.id

                        })

                    })
                    .then(function(response) {
                        if (response) {
                            location.reload()
                            return
                        }
                        throw new Error('Request failed.')
                    })
                    .catch(function(error) {
                        console.log(error)
                    })

            }
        });

    })
    // UPDATE TITLE
    article.children[0].addEventListener('click', function(){
        // TROUVER FONCTION POUR MODIFIER LE 'h2' EN 'input' 
    });
});

// ENABLE TAGS

let activeTag = '';

document.querySelectorAll('.container__body__wrapper__categories__tags').forEach(function(tag){
    let children = [].slice.call(tag.children);
    
    tag.addEventListener('click', function(){
        children.forEach(function(child){
            if(activeTag != child){
                if(activeTag != ''){
                    activeTag.disabled = true;
                };
                child.disabled = false;
                activeTag = child;
            }else{
                activeTag = '';
                child.disabled = true;
            }
        });
    })
});

// POST + VERIF & ERROR ANIMATION

$('.container__body__wrapper__new__add').addEventListener('click', function(){

    let tag;
    if($('.container__body__wrapper__categories__tags > input:enabled') != null){
        tag = $('.container__body__wrapper__categories__tags > input:enabled').value;
    }else{
        tag = null;
    }
    
        fetch('/newprjct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: $('.container__body__wrapper__new__name').value,
                category: tag
            })
    
        })
        .then(function(response) {
            if(response.redirected == false){
                $('.container__body__wrapper__new').style.transition = '.1s';
                $('.container__body__wrapper__new').style.transform = 'translateX(-2%)';
                document.documentElement.style.setProperty('--placeH', '#F00');
                $('.container__body__wrapper__new__name').style.border = '1px solid #F00';
                setTimeout(function(){
                    $('.container__body__wrapper__new').style.transform = 'translateX(2%)';
                }, 100);
                setTimeout(function(){
                    $('.container__body__wrapper__new').style.transform = 'translateX(-2%)';
                    setTimeout(function(){
                        $('.container__body__wrapper__new').style.transform = 'translateX(2%)';
                        setTimeout(function(){
                            $('.container__body__wrapper__new').style.transform = 'translateX(0)';
                        }, 100);
                    }, 100);
                }, 200);
            }else{
                window.location.reload(true);
            }
        })
        .catch(function(error){
            console.log(error);
        })
    
    
    });

$('.container__body__wrapper__new__name').addEventListener('focus', function(){
    document.documentElement.style.setProperty('--placeH', 'grey');
    $('.container__body__wrapper__new__name').style.border = 'none';
});
// FILTER PROJECTS BY CLASS

function filter(e){
    document.querySelectorAll('.container__body__wrapper__project').forEach(function(element){
        if(e == 'all'){
                element.style.display = 'block';
        }else{
            if(element.classList.contains(e)){
                element.style.display = 'block';
            }else{
                element.style.display = 'none';
            }
        }
    });
}

// CROSSED/UNCROSSED UPDATE

let taskId,
    taskName,
    projectId,
    type;

document.querySelectorAll('.container__body__wrapper__project').forEach(function(prjct){
    prjct.querySelectorAll('.container__body__wrapper__project__loop__task').forEach(function(task){
        
        task.addEventListener('click', function(){
            taskId = task.id,
            taskName = task.innerHTML,
            projectId = prjct.id,
            type;
            if(task.classList.contains('crossed')){
                task.classList.remove('crossed');
                type = '';
                update();
            }else{
                task.classList.add('crossed');
                type = 'crossed';
                update();
            }
        })
    });
});

function update(){
    console.log(projectId);
    console.log(taskId);

    fetch('/updatetask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            _id: taskId,
            task: taskName,
            prjctID: projectId,
            type: type
        })

    })
    .then(function(response) {
        if (response.ok) {
            console.log('Update was recorded')
            location.reload();
            return;
        }
        throw new Error('Request failed.')
    })
    .catch(function(error) {
        console.log(error)
    })

}
    