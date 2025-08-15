document.addEventListener("DOMContentLoaded",function(){
  document.querySelectorAll('[role="tablist"]').forEach(function(list){
    var wrapper=document.createElement("div")
    wrapper.style.position="relative"
    list.parentNode.insertBefore(wrapper,list)
    wrapper.appendChild(list)
    var left=document.createElement("button")
    var right=document.createElement("button")
    left.innerHTML="◀"
    right.innerHTML="▶"
    ;[left,right].forEach(function(btn){
      btn.style.position="absolute"
      btn.style.top="50%"
      btn.style.transform="translateY(-50%)"
      btn.style.zIndex="10"
      btn.style.background="rgba(0,0,0,0.5)"
      btn.style.color="#fff"
      btn.style.border="none"
      btn.style.cursor="pointer"
      btn.style.padding="0.25rem 0.5rem"
    })
    left.style.left="0"
    right.style.right="0"
    wrapper.appendChild(left)
    wrapper.appendChild(right)
    left.addEventListener("click",function(){list.scrollBy({left:-150,behavior:"smooth"})})
    right.addEventListener("click",function(){list.scrollBy({left:150,behavior:"smooth"})})
    list.addEventListener("wheel",function(e){
      if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){
        e.preventDefault()
        list.scrollBy({left:e.deltaY,behavior:"smooth"})
      }
    },{passive:false})
  })
})
