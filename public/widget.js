const bubble = document.createElement('button')

bubble.innerHTML = '💬'

bubble.style.position = 'fixed'
bubble.style.bottom = '20px'
bubble.style.right = '20px'
bubble.style.width = '60px'
bubble.style.height = '60px'
bubble.style.borderRadius = '50%'
bubble.style.border = 'none'
bubble.style.cursor = 'pointer'
bubble.style.fontSize = '24px'
bubble.style.zIndex = '9999'

document.body.appendChild(bubble)

bubble.onclick = () => {
    alert('BizBot Widget Coming Soon')
}