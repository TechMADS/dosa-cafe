### Imports 

```

import type React from "react"
import Image from "next/image"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ShoppingCart,
  Plus,
  ChevronLeft,
  ChevronRight,
  Settings,
  X,
  Minus,
  Trash2,
  User,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle,
  Clock,
  MessageCircle,
} from "lucide-react"

```




### Interfaces
```

// Enhanced cart item interface to store detailed information
interface CartItem {
  id: string
  dosaId: number
  dosaName: string
  basePrice: number
  toppings: Array<{ id: number; name: string; price: number }>
  quantity: number
  totalPrice: number
}

// Customer information interface
interface CustomerInfo {
  name: string
  phone: string
  address: string
  landmark: string
}

// Order interface
interface Order {
  id: string
  items: CartItem[]
  customerInfo: CustomerInfo
  paymentMethod: string
  totalAmount: number
  status: string
  estimatedDelivery: string
  orderTime: string
}

```


### Dosa Varieties
```

// Dosa varieties with base prices
const dosaVarieties = [
  {
    id: 1,
    name: "Plain Dosa",
    description: "Classic crispy dosa made with fermented rice and lentil batter",
    basePrice: 80,
    image: "/golden-crispy-plain-dosa.png",
  },
  {
    id: 2,
    name: "Masala Dosa",
    description: "Traditional dosa filled with spiced potato curry",
    basePrice: 120,
    image: "/masala-dosa-chutney.png",
  },
  {
    id: 3,
    name: "Cheese Dosa",
    description: "Crispy dosa loaded with melted cheese",
    basePrice: 150,
    image: "/cheese-dosa-herbs.png",
  },
  {
    id: 4,
    name: "Rava Dosa",
    description: "Thin and crispy semolina dosa with a unique texture",
    basePrice: 100,
    image: "/crispy-rava-dosa.png",
  },
  {
    id: 5,
    name: "Paneer Dosa",
    description: "Stuffed with spiced cottage cheese and vegetables",
    basePrice: 180,
    image: "/paneer-dosa.png",
  },
]

```


### Available Toppings
```

// Available toppings with prices
const availableToppings = [
  { id: 1, name: "Extra Cheese", price: 30, color: "#FFD700", image: "/melted-cheese.png" },
  { id: 2, name: "Paneer Cubes", price: 40, color: "#F5F5DC", image: "/paneer-cubes.png" },
  { id: 3, name: "Mushrooms", price: 25, color: "#8B4513", image: "/sliced-mushrooms.png" },
  { id: 4, name: "Onions", price: 15, color: "#DDA0DD", image: "/sliced-onions.png" },
  { id: 5, name: "Tomatoes", price: 20, color: "#FF6347", image: "/diced-tomatoes.png" },
  { id: 6, name: "Green Chilies", price: 10, color: "#32CD32", image: "/green-chilies.png" },
  { id: 7, name: "Coriander", price: 15, color: "#228B22", image: "/fresh-coriander.png" },
  { id: 8, name: "Coconut", price: 20, color: "#FFFAF0", image: "/grated-coconut.png" },
]

```


### States
```

  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [currentDosaIndex, setCurrentDosaIndex] = useState(2) // Start with middle item
  const [showToppingsModal, setShowToppingsModal] = useState(false)
  const [selectedToppings, setSelectedToppings] = useState<
    Array<{ id: number; name: string; price: number; x: number; y: number }>
  >([])
  const [draggedTopping, setDraggedTopping] = useState<any>(null)

  // Added checkout and order states
  const [showCheckout, setShowCheckout] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    address: "",
    landmark: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false)
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackName, setFeedbackName] = useState("")
  const [feedbackMsg, setFeedbackMsg] = useState("")

  const [searchText, setSearchText] = useState("")

```

### Feedback Functions
```

// Feedback functions
  const whatsappNumber = "916382619604"

  const handleFeedbackSubmit = () => {
    const text = `Feedback from ${feedbackName || "Anonymous"}:\n${feedbackMsg}`
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
    setShowFeedback(false)
    setFeedbackName("")
    setFeedbackMsg("")
  }

  const emailId = "dineshg1729@gmail.com"

  const handleFeedbackSubmitMail = () => {
    const subject = `Feedback from ${feedbackName || "Anonymous"}`;
    const body = `${feedbackMsg}`;
    const mailtoLink = `mailto:${emailId}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;

    setShowFeedback(false);
    setFeedbackName("");
    setFeedbackMsg("");
  };

```


### Dosa swiper for mobile screen
```

  // Dosa swiper for mobile screen
  let startX = 0;
  let endX = 0;

  const nextDosa = () => {
    setCurrentDosaIndex((prev) => (prev + 1) % dosaVarieties.length)
  }

  const prevDosa = () => {
    setCurrentDosaIndex((prev) => (prev - 1 + dosaVarieties.length) % dosaVarieties.length)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        prevDosa();
      } else {
        nextDosa();
      }
    }
  };

```


### Visible Dosa with Search method
```

  // Visible Dosa with Search method...
  const getVisibleDosas = () => {
    let filtered = dosaVarieties.filter(dosa =>
      dosa.name.toLowerCase().includes(searchText.toLowerCase())
    )
    if (filtered.length === 0) filtered = dosaVarieties
    const visible = []
    for (let i = -2; i <= 2; i++) {
      const index = (currentDosaIndex + i + filtered.length) % filtered.length
      visible.push({
        ...filtered[index],
        position: i,
        isCenter: i === 0,
      })
    }
    return visible
  }

  // const getVisibleDosas = () => {
  //   const visible = []
  //   for (let i = -2; i <= 2; i++) {
  //     const index = (currentDosaIndex + i + dosaVarieties.length) % dosaVarieties.length
  //     visible.push({
  //       ...dosaVarieties[index],
  //       position: i,
  //       isCenter: i === 0,
  //     })
  //   }
  //   return visible
  // }

```


### Cart Functions
```

  // Cart Functions
  const currentDosa = dosaVarieties[currentDosaIndex]
  const toppingsPrice = selectedToppings.reduce((sum, topping) => sum + topping.price, 0)
  const totalPrice = currentDosa.basePrice + toppingsPrice

  // Enhanced cart functions to handle detailed cart items
  const addToCart = (dosa: any, toppings: any[] = []) => {
    setCart((prev) => {
      // Check if item with same dosa + toppings already exists
      const existingItemIndex = prev.findIndex(
        (item) =>
          item.dosaId === dosa.id &&
          JSON.stringify(item.toppings) === JSON.stringify(toppings.map((t) => ({ id: t.id, name: t.name, price: t.price })))
      )

      if (existingItemIndex !== -1) {
        // If exists → update quantity & total price
        const updatedCart = [...prev]
        const existingItem = updatedCart[existingItemIndex]
        updatedCart[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
        }
        return updatedCart
      } else {
        // Otherwise → create new item
        const cartItem: CartItem = {
          id: Date.now().toString() + Math.random(),
          dosaId: dosa.id,
          dosaName: dosa.name,
          basePrice: dosa.basePrice,
          toppings: toppings.map((t) => ({ id: t.id, name: t.name, price: t.price })),
          quantity: 1,
          totalPrice: dosa.basePrice + toppings.reduce((sum, t) => sum + t.price, 0),
        }
        return [...prev, cartItem]
      }
    })
  }


  // const addToCart = (dosa: any, toppings: any[] = []) => {
  //   const cartItem: CartItem = {
  //     id: Date.now().toString() + Math.random(),
  //     dosaId: dosa.id,
  //     dosaName: dosa.name,
  //     basePrice: dosa.basePrice,
  //     toppings: toppings.map((t) => ({ id: t.id, name: t.name, price: t.price })),
  //     quantity: 1,
  //     totalPrice: dosa.basePrice + toppings.reduce((sum, t) => sum + t.price, 0),
  //   }

  //   setCart((prev) => [...prev, cartItem])
  // }

  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId))
  }

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0)
  }

  const getCartItemsCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

```

### Checkout functions
```

  // Calculate bill details with taxes and charges
  const cartSubtotal = getCartTotal()
  const deliveryCharge = cartSubtotal > 0 ? (cartSubtotal >= 500 ? 0 : 40) : 0
  const gstRate = 0.05 // 5% GST
  const gstAmount = cartSubtotal * gstRate
  const finalTotal = cartSubtotal + deliveryCharge + gstAmount

  // Added order placement and payment functions
  const proceedToCheckout = () => {
    setShowCart(false)
    setShowCheckout(true)
  }

  const placeOrder = () => {
    // Generate order ID and estimated delivery time
    const orderId = `DC${Date.now().toString().slice(-6)}`
    const orderTime = new Date().toLocaleString()
    const estimatedDelivery = new Date(Date.now() + 45 * 60 * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

    const order: Order = {
      id: orderId,
      items: [...cart],
      customerInfo: { ...customerInfo },
      paymentMethod,
      totalAmount: finalTotal,
      status: "confirmed",
      estimatedDelivery,
      orderTime,
    }

    setCurrentOrder(order)
    setShowCheckout(false)
    setShowOrderConfirmation(true)

    // Clear cart after successful order
    setCart([])

    // Reset customer info for next order
    setCustomerInfo({
      name: "",
      phone: "",
      address: "",
      landmark: "",
    })
  }

  const isCheckoutValid = () => {
    return (
      customerInfo.name.trim() !== "" &&
      customerInfo.phone.trim() !== "" &&
      customerInfo.address.trim() !== "" &&
      paymentMethod !== ""
    )
  }

```


### Drag and drop functions
```

  // Drag and drop functions
  const handleDragStart = (e: React.DragEvent, topping: any) => {
    setDraggedTopping(topping)
    e.dataTransfer.effectAllowed = "copy"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedTopping) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Ensure toppings stay within dosa bounds (roughly circular)
    const centerX = 50,
      centerY = 50,
      radius = 35
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)

    if (distance <= radius) {
      const newTopping = {
        ...draggedTopping,
        x: Math.max(10, Math.min(90, x)),
        y: Math.max(10, Math.min(90, y)),
        uniqueId: Date.now() + Math.random(),
      }
      setSelectedToppings((prev) => [...prev, newTopping])
    }
    setDraggedTopping(null)
  }

  const removeTopping = (uniqueId: number) => {
    setSelectedToppings((prev) => prev.filter((t) => t.id !== uniqueId))
  }

  const addToCartWithToppings = () => {
    addToCart(currentDosa, selectedToppings)
    setShowToppingsModal(false)
    setSelectedToppings([])
  }

  const addToCartSimple = () => {
    addToCart(currentDosa, [])
  }

```