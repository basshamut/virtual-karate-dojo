import CheckoutForm from "./CheckoutForm.jsx"

export default function PaymentCard(props) {
    const {meet} = props
    return (
        <div>
            <CheckoutForm key={meet.id} meet={meet}/>
        </div>
    )
}
