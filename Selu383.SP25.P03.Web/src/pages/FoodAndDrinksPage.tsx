import "../styles/MenuItem.css";
export default function FoodAndDrinksPage() {
  const items = [
    {
      name: 'Mozarella Sticks',
      description: '4 Fried Mozarella Sticks served with marinara sauce',
      image: 'https://imgur.com/ZPJRaPj.jpg'
    },
    {
      name: 'Cheeseburger Sliders',
      description: '3 Delicious Cheeseburger Sliders dressed with cheddar cheese and a pickle',
      image: 'https://imgur.com/TkGozIU.jpg'
    },
    {
      name: 'Southwest Egg Rolls',
      description: '6 Tasty Southwest Egg Rolls served with dipping sauce',
      image: 'https://imgur.com/nAikWFY.jpg'
    }
  ]

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Food & Drinks</h1>
      <p style ={{marginBottom:'30px'}}>Have your favorite meal delivered to your seat!</p>
      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', marginTop: '1rem', justifyContent:'center'}}>
        {items.map((item, idx) => (
          <div key={idx} style={{ width: '300px', borderRadius: '8px', padding: '1rem',backgroundColor:'#f5f5f5'}}>
            <img src={item.image} alt={item.name} style={{ width: '100%', borderRadius: '8px', height:'50%'}} />
            <h2>{item.name}</h2>
            <p style={{height:'10%', maxWidth:'100%'}}>{item.description}</p>
            <button className="menu-item-button">Order Now</button>
          </div>
        ))}
      </div>
    </div>
  )
}

  