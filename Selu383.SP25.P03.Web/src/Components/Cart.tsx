import {
  Card,
  Group,
  Text,
  Button,
  Divider,
  Stack,
  Badge,
} from "@mantine/core";
import { isSeatItem, isFoodItem, CartItem } from "../hooks/cartContext";

const PRICE_MAP: Record<"Adult" | "Child" | "Senior", number> = {
  Adult: 12,
  Child: 8,
  Senior: 10,
};

interface CartProps {
  items: CartItem[];
  onCheckout: () => void;
  title?: string;
  onTicketTypeChange?: (
    seatId: string,
    type: "Adult" | "Child" | "Senior"
  ) => void;
  onRemoveItem?: (id: string) => void;
  onUpdateFoodQuantity?: (id: string, quantity: number) => void;
  isDropdown?: boolean;
}

export function Cart({
  items,
  onCheckout,
  title = "Your Cart",
  onTicketTypeChange,
  onRemoveItem,
  onUpdateFoodQuantity,
  isDropdown = false,
}: CartProps) {
  // Calculate total price
  const total = items.reduce((sum, item) => {
    if (isSeatItem(item)) {
      return sum + PRICE_MAP[item.ticketType];
    } else if (isFoodItem(item)) {
      return sum + item.price * item.quantity;
    }
    return sum;
  }, 0);

  // Count items in cart
  const itemCount = items.reduce((count, item) => {
    if (isFoodItem(item)) {
      return count + item.quantity;
    }
    return count + 1; // Each ticket counts as 1
  }, 0);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group p="apart">
        <Text
          fw={600}
          style={{
            fontSize: isDropdown ? "24px" : "32px",
            marginBottom: "1rem",
            marginTop: "10px",
          }}
        >
          {title}
        </Text>
        {!isDropdown && <Badge size="lg">{itemCount} items</Badge>}
      </Group>
      <Divider my="xs" />

      {items.length === 0 ? (
        <Text>Your cart is empty</Text>
      ) : (
        <Stack
          gap="sm"
          style={{
            maxHeight: isDropdown ? "300px" : "auto",
            overflowY: "auto",
          }}
        >
          {/* Render Ticket Items */}
          {items.filter(isSeatItem).map((seat) => (
            <div
              key={seat.id}
              style={{
                backgroundColor: "#f5f5f5",
                padding: "0.75rem",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            >
              <Group p="apart">
                <Text
                  style={{
                    fontSize: isDropdown ? "16px" : "20px",
                    marginTop: "0",
                    marginBottom: "5px",
                  }}
                >
                  {`Seat ${seat.row}-${seat.id}`}
                </Text>

                {onTicketTypeChange && (
                  <select
                    value={seat.ticketType}
                    onChange={(e) =>
                      onTicketTypeChange(
                        seat.id,
                        e.target.value as "Adult" | "Child" | "Senior"
                      )
                    }
                    style={{
                      padding: "4px 8px",
                      fontSize: "14px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="Adult">Adult</option>
                    <option value="Child">Child</option>
                    <option value="Senior">Senior</option>
                  </select>
                )}

                <Text style={{ marginTop: "5px", marginBottom: "0px" }}>
                  ${PRICE_MAP[seat.ticketType].toFixed(2)}
                </Text>

                {onRemoveItem && (
                  <Button
                    variant="subtle"
                    color="red"
                    onClick={() => onRemoveItem(seat.id)}
                    style={{ padding: "0 8px" }}
                  >
                    ✕
                  </Button>
                )}
              </Group>
            </div>
          ))}

          {/* Render Food Items */}
          {items.filter(isFoodItem).map((food) => (
            <div
              key={food.id}
              style={{
                backgroundColor: "black",
                padding: "0.75rem",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            >
              <Group p="apart">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {!isDropdown && (
                    <img
                      src={food.image}
                      alt={food.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "4px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div>
                    <Text
                      color="white"
                      style={{
                        fontSize: isDropdown ? "16px" : "18px",
                        marginTop: "0",
                        marginBottom: "5px",
                      }}
                    >
                      {food.name}
                    </Text>
                    <Text size="xs" color="dimmed">
                      ${food.price.toFixed(2)} each
                    </Text>
                  </div>
                </div>

                <Group>
                  {onUpdateFoodQuantity && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <Button
                        variant="subtle"
                        onClick={() =>
                          food.quantity > 1 &&
                          onUpdateFoodQuantity(food.id, food.quantity - 1)
                        }
                        style={{ padding: "0 8px" }}
                      >
                        -
                      </Button>
                      <Text>{food.quantity}</Text>
                      <Button
                        variant="subtle"
                        onClick={() =>
                          onUpdateFoodQuantity(food.id, food.quantity + 1)
                        }
                        style={{ padding: "0 8px" }}
                      >
                        +
                      </Button>
                    </div>
                  )}

                  <Text
                    style={{
                      marginTop: "5px",
                      marginBottom: "0px",
                      minWidth: "60px",
                      textAlign: "right",
                    }}
                  >
                    ${(food.price * food.quantity).toFixed(2)}
                  </Text>

                  {onRemoveItem && (
                    <Button
                      variant="subtle"
                      color="red"
                      onClick={() => onRemoveItem(food.id)}
                      style={{ padding: "0 8px" }}
                    >
                      ✕
                    </Button>
                  )}
                </Group>
              </Group>
            </div>
          ))}
        </Stack>
      )}

      <Divider my="sm" />

      <Group p="apart" mt="md">
        <Text fw={600}>Total: ${total.toFixed(2)}</Text>
        <Button
          onClick={onCheckout}
          style={{
            backgroundColor: "#fdba74",
            borderRadius: "5px",
            border: 0,
            height: "40px",
            width: isDropdown ? "100%" : "100px",
            cursor: "pointer",
            color: "#100e0e",
          }}
        >
          Checkout
        </Button>
      </Group>
    </Card>
  );
}
