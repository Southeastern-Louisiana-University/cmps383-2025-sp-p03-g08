export default function FoodAndDrinksPage() {
    const items = [
      {
        name: 'Mozarella Sticks',
        description: '4 Fried Mozarella Sticks served with marinara sauce',
        image: '/assets/mozarella-sticks.jpg'
      },
      {
        name: 'Cheeseburger Sliders',
        description: '3 Delicious Cheeseburger Sliders dressed with cheddar cheese and a pickle',
        image: '/assets/sliders.jpg'
      },
      {
        name: 'Southwest Egg Rolls',
        description: '6 Tasty Southwest Egg Rolls served with dipping sauce',
        image: '/assets/egg-rolls.jpg'
      }
    ]
  
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Food & Drinks</h1>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ width: '300px', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', borderRadius: '8px' }} />
              <h2>{item.name}</h2>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  