import Modal from "src/lib/components/modal"


class MoreInfo extends HTMLElement {

  constructor(){
    super()

    const buttonMore = this.querySelectorAll('.buttons-more')as NodeListOf<HTMLButtonElement>

    const modal = new Modal({
      title:"HOla"
    })

    buttonMore.forEach(button =>{
      button.addEventListener('click', modal.build)
    } )
  
  }
}

customElements.define("modal-more-info", MoreInfo);