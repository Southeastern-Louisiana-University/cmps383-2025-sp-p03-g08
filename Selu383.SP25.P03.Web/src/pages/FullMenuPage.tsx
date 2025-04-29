export default function FullMenuPage() {
    const menuItems = [
      {
        name: 'Mozarella Sticks',
        description: '4 Fried Mozarella Sticks served with marinara sauce',
        image: '/assets/mozarella-sticks.jpg'
      },
      {
        name: 'Cheeseburger Sliders',
        description: '3 Delicious Cheeseburger Sliders with crisp french fries',
        image: '/assets/sliders.jpg'
      },
      {
        name: 'Southwest Egg Rolls',
        description: '6 Tasty Southwest Egg Rolls served with dipping sauce',
        image: '/assets/egg-rolls.jpg'
      },
      {
        name: 'Mozarella Sticks (Double)',
        description: '8 Fried Mozarella Sticks served with marinara sauce',
        image: '/assets/mozarella-sticks.jpg'
      },
      {
        name: 'Cheeseburger Sliders (Double)',
        description: '6 Delicious Cheeseburger Sliders with crisp french fries',
        image: '/assets/sliders.jpg'
      },
      {
        name: 'Southwest Egg Rolls (Double)',
        description: '12 Tasty Southwest Egg Rolls served with dipping sauce',
        image: '/assets/egg-rolls.jpg'
      }
    ]
  
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Our Full Menu</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
          {menuItems.map((item, idx) => (
            <div key={idx} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', borderRadius: '8px' }} />
              <h2>{item.name}</h2>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  