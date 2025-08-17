"use client"

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

export default function DosaCafe() {
  // Enhanced cart state to store detailed cart items
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-orange-200 sticky top-0 left-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-3">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  <Image src="/image.png" alt="Dosa Cafe" width={40} height={40} />
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dosa Cafe</h1>
                <p className="text-sm text-gray-600">Authentic South Indian Flavors</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex justify-center mb-4 mt-4">
              <Input
                type="text"
                placeholder="Search dosa..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="w-full max-w-md border-orange-300 focus:border-orange-500"
              />
            </div>

            {/* Enhanced cart button with click handler */}
            <Button
              variant="outline"
              className="relative border-orange-300 hover:bg-orange-50 bg-transparent"
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart className="w-5 h-5 m-0 md:mr-2" />
              <span className="hidden md:inline">Cart</span>
              {getCartItemsCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white">{getCartItemsCount()}</Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-4 px-4 opacity-90 h-[100vh]">

        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden mt-15">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/bgvideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="max-w-4xl mx-auto h-screen flex flex-col justify-center items-center text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Crispy, Golden, <span className="text-orange-600">Delicious</span>
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Experience the authentic taste of South India with our freshly made dosas, served with traditional chutneys
            and sambar
          </p>
        </div>

      </section>



      {/* Interactive Dosa Slider */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Choose Your Dosa</h3>

          {/* Slider Container */}
          <div className="relative">
            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-[45%] -translate-y-1/2 z-21 bg-white/90 border-orange-300 hover:bg-orange-50 shadow-lg"
              onClick={prevDosa}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-[45%] -translate-y-1/2 z-21 bg-white/90 border-orange-300 hover:bg-orange-50 shadow-lg"
              onClick={nextDosa}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Slider Track */}
            <div
              className="flex items-center justify-center gap-4 py-8 overflow-hidden"
              ref={sliderRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {getVisibleDosas().map((dosa, index) => (
                <div
                  key={`${dosa.id}-${index}`}
                  className={`transition-all duration-500 ease-in-out ${dosa.isCenter
                    ? "scale-110 z-10"
                    : Math.abs(dosa.position) === 1
                      ? "scale-90 opacity-70"
                      : "scale-75 opacity-40"
                    }`}
                  style={{
                    transform: `translateX(${dosa.position * 20}px)`,
                  }}
                >
                  <Card
                    className={`w-80 overflow-hidden transition-all duration-300 ${dosa.isCenter
                      ? "shadow-2xl border-2 border-orange-300 bg-white"
                      : "shadow-md border-orange-200 hover:shadow-lg"
                      }`}
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={dosa.image || "/placeholder.svg"}
                        alt={dosa.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xl font-semibold text-gray-900">{dosa.name}</h4>
                        <Badge
                          variant="secondary"
                          className={`${dosa.isCenter ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-800"}`}
                        >
                          ₹{dosa.basePrice}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{dosa.description}</p>

                      {dosa.isCenter ? (
                        <div className="space-y-3">
                          {/* Updated add to cart handler */}
                          <Button
                            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-600 text-white font-semibold py-3"
                            onClick={addToCartSimple}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Cart - ₹{dosa.basePrice} {(() => {
                              const cartItem = cart.find((c) => c.dosaId === currentDosa.id);
                              return cartItem && cartItem.quantity > 0 ? `Added (${cartItem.quantity})` : "";
                            })()}
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent font-semibold py-3"
                            onClick={() => setShowToppingsModal(true)}
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Add Toppings & Customize
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          className="w-full text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                          onClick={() => {
                            const targetIndex = dosaVarieties.findIndex((d) => d.id === dosa.id)
                            setCurrentDosaIndex(targetIndex)
                          }}
                        >
                          Select This Dosa
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Slider Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {dosaVarieties.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentDosaIndex ? "bg-orange-500 scale-125" : "bg-orange-200 hover:bg-orange-300"
                    }`}
                  onClick={() => setCurrentDosaIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Floating Feedback Button */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 flex items-center gap-2 transition-all"
        onClick={() => setShowFeedback(true)}
        aria-label="Send Feedback"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="font-semibold hidden sm:inline">Feedback</span>
      </button>

      {/* Feedback Modal */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Send Feedback
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label htmlFor="feedback-name">Your Name *</Label>
              <Input
                id="feedback-name"
                value={feedbackName}
                onChange={e => setFeedbackName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <Label htmlFor="feedback-msg">Your Feedback *</Label>
              <Textarea
                id="feedback-msg"
                value={feedbackMsg}
                onChange={e => setFeedbackMsg(e.target.value)}
                placeholder="Type your feedback here"
                rows={4}
              />
            </div>
            <div
              className="w-full flex justify-between p-4"
            >
              <Button
                className="w-[47%] bg-green-500 hover:bg-green-600 text-white"
                onClick={handleFeedbackSubmit}
                disabled={!feedbackMsg.trim() || !feedbackName.trim()}
              >
                Send via WhatsApp
              </Button>
              <Button
                className="w-[47%] bg-green-500 hover:bg-green-600 text-white"
                onClick={handleFeedbackSubmitMail}
                disabled={!feedbackMsg.trim() || !feedbackName.trim()}
              >
                Send via Mail
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shopping Cart Modal with detailed billing */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Your Order ({getCartItemsCount()} items)
            </DialogTitle>
          </DialogHeader>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some delicious dosas to get started!</p>
              <Button onClick={() => setShowCart(false)} className="bg-orange-500 hover:bg-orange-600 text-white">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={item.id} className="border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.dosaName}</h4>
                          <p className="text-sm text-gray-600">Base Price: ₹{item.basePrice}</p>
                          {item.toppings.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-700">Toppings:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.toppings.map((topping) => (
                                  <Badge
                                    key={topping.id}
                                    variant="secondary"
                                    className="text-xs bg-orange-100 text-orange-800"
                                  >
                                    {topping.name} (+₹{topping.price})
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-orange-300 bg-transparent"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="font-medium text-gray-900 min-w-[2rem] text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-orange-300 bg-transparent"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{item.totalPrice * item.quantity}</p>
                          <p className="text-xs text-gray-500">₹{item.totalPrice} each</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Bill Summary */}
              <Card className="border-2 border-orange-200 bg-orange-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal ({getCartItemsCount()} items)</span>
                      <span>₹{cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Delivery Charges</span>
                      <span className={deliveryCharge === 0 ? "text-green-600" : ""}>
                        {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>GST (5%)</span>
                      <span>₹{gstAmount.toFixed(2)}</span>
                    </div>
                    <hr className="border-orange-200" />
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total Amount</span>
                      <span>₹{finalTotal.toFixed(2)}</span>
                    </div>
                    {deliveryCharge > 0 && (
                      <p className="text-xs text-gray-600 mt-2">
                        Add ₹{(500 - cartSubtotal).toFixed(2)} more for free delivery!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300 bg-transparent"
                  onClick={() => setShowCart(false)}
                >
                  Continue Shopping
                </Button>
                {/* Updated checkout button to open checkout flow */}
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={proceedToCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Added Checkout Modal */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Checkout</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* Customer Information Form */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter your complete delivery address"
                      className="border-orange-200 focus:border-orange-400"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="landmark">Landmark (Optional)</Label>
                    <Input
                      id="landmark"
                      value={customerInfo.landmark}
                      onChange={(e) => setCustomerInfo((prev) => ({ ...prev, landmark: e.target.value }))}
                      placeholder="Nearby landmark for easy delivery"
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h3>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-3 border border-orange-200 rounded-lg hover:bg-orange-50">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Banknote className="w-4 h-4" />
                      Cash on Delivery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border border-orange-200 rounded-lg hover:bg-orange-50">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone className="w-4 h-4" />
                      UPI Payment
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border border-orange-200 rounded-lg hover:bg-orange-50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="w-4 h-4" />
                      Credit/Debit Card
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                <Card className="border-orange-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-start text-sm">
                          <div className="flex-1">
                            <p className="font-medium">
                              {item.dosaName} x{item.quantity}
                            </p>
                            {item.toppings.length > 0 && (
                              <p className="text-gray-600 text-xs">+ {item.toppings.map((t) => t.name).join(", ")}</p>
                            )}
                          </div>
                          <p className="font-medium">₹{item.totalPrice * item.quantity}</p>
                        </div>
                      ))}
                      <hr className="border-orange-200" />
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>₹{cartSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery</span>
                          <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>GST (5%)</span>
                          <span>₹{gstAmount.toFixed(2)}</span>
                        </div>
                        <hr className="border-orange-200" />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>₹{finalTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Estimated Delivery Time */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Estimated Delivery: 35-45 minutes</span>
                  </div>
                </CardContent>
              </Card>

              {/* Place Order Button */}
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold"
                onClick={placeOrder}
                disabled={!isCheckoutValid()}
              >
                Place Order - ₹{finalTotal.toFixed(2)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Added Order Confirmation Modal */}
      <Dialog open={showOrderConfirmation} onOpenChange={setShowOrderConfirmation}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-8">
            <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your order. We're preparing your delicious dosas!
            </p>

            {currentOrder && (
              <Card className="border-2 border-green-200 bg-green-50 mb-8">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-bold text-lg text-gray-900">{currentOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-bold text-lg text-gray-900">₹{currentOrder.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <p className="font-bold text-lg text-gray-900">{currentOrder.estimatedDelivery}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-bold text-lg text-gray-900">
                        {currentOrder.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : currentOrder.paymentMethod === "upi"
                            ? "UPI Payment"
                            : "Card Payment"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-green-200">
                    <p className="text-sm text-gray-600 mb-2">Delivery Address</p>
                    <p className="font-medium text-gray-900">{currentOrder.customerInfo.name}</p>
                    <p className="text-gray-700">{currentOrder.customerInfo.phone}</p>
                    <p className="text-gray-700">{currentOrder.customerInfo.address}</p>
                    {currentOrder.customerInfo.landmark && (
                      <p className="text-gray-600 text-sm">Near: {currentOrder.customerInfo.landmark}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                className="border-gray-300 bg-transparent"
                onClick={() => setShowOrderConfirmation(false)}
              >
                Continue Shopping
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => {
                  setShowOrderConfirmation(false)
                  // In a real app, this would navigate to order tracking
                  alert(`Track your order ${currentOrder?.id} via SMS updates!`)
                }}
              >
                Track Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Toppings Customization Modal */}
      <Dialog open={showToppingsModal} onOpenChange={setShowToppingsModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Customize Your {currentDosa.name}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* Dosa Canvas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Drag toppings onto your dosa</h3>
              <div
                className="relative bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8 border-2 border-dashed border-orange-300 min-h-[400px] flex items-center justify-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {/* Dosa Base */}
                <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-yellow-200 to-amber-300 border-4 border-amber-400 shadow-lg overflow-hidden">
                  <img
                    src={currentDosa.image || "/placeholder.svg"}
                    alt={currentDosa.name}
                    className="w-full h-full object-cover rounded-full opacity-90"
                  />

                  {/* Dropped Toppings */}
                  {selectedToppings.map((topping) => (
                    <div
                      key={topping.id}
                      className="absolute w-20 h-20 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform group"
                      style={{
                        left: `${topping.x}%`,
                        top: `${topping.y}%`,
                        // backgroundColor: availableToppings.find((t) => t.id === topping.id)?.color,
                        backgroundImage: `url(${availableToppings.find((t) => t.id === topping.id)?.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        transform: "translate(-50%, -50%)",
                      }}
                      onClick={() => removeTopping(topping.id)}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {topping.name} - Click to remove
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                  <p className="text-sm text-gray-600 mb-2">Drop toppings here</p>
                  <Badge className="bg-orange-500 text-white text-lg px-4 py-2">Total: ₹{totalPrice}</Badge>
                </div>
              </div>
            </div>

            {/* Toppings Palette */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Available Toppings</h3>
              <div className="grid grid-cols-2 gap-4">
                {availableToppings.map((topping) => (
                  <Card
                    key={topping.id}
                    className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow border-orange-200"
                    style={{ backgroundColor: topping.color }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, topping)}
                  >
                    <CardContent
                      className="p-4 text-center"
                      style={{
                        backgroundImage: `url(${topping.image})`,
                        backgroundSize: "cover",     // or "contain"
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        width: "100%",
                        height: "100%",
                      }}>
                      <div
                        className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-gray-300"
                        style={{ backgroundColor: topping.color }}
                      />
                      <h4 className="font-medium text-gray-900 text-sm">{topping.name}</h4>
                      <Badge variant="secondary" className="mt-1 bg-orange-100 text-orange-800">
                        +₹{topping.price}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Toppings Summary */}
              {selectedToppings.length > 0 && (
                <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Selected Toppings:</h4>
                  <div className="space-y-1">
                    {selectedToppings.map((topping) => (
                      <div key={topping.id} className="flex justify-between items-center text-sm">
                        <span>{topping.name}</span>
                        <div className="flex items-center gap-2">
                          <span>₹{topping.price}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 hover:bg-red-100"
                            onClick={() => removeTopping(topping.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300 bg-transparent"
                  onClick={() => {
                    setShowToppingsModal(false)
                    setSelectedToppings([])
                  }}
                >
                  Cancel
                </Button>
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={addToCartWithToppings}>
                  Add to Cart - ₹{totalPrice}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h4 className="text-xl font-semibold mb-2">Dosa Cafe</h4>
          <p className="text-gray-400">Serving authentic South Indian cuisine since 2020</p>
        </div>
      </footer> */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 mt-16" aria-label="Site Footer">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">
            {/* Brand & Description */}
            <div className="text-center md:text-left">
              <h4 className="text-2xl font-bold mb-2 tracking-wide text-orange-400">Dosa Cafe</h4>
              <p className="text-gray-300 mb-3">
                <span className="font-semibold">Serving authentic South Indian cuisine since 2020.</span>
                <br />
                Freshly made dosas, chutneys, and sambar delivered to your doorstep in <span className="text-orange-200">Tirunelveli</span>.
              </p>
              <div className="flex justify-center md:justify-start gap-3 mt-2">
                <a
                  href="https://wa.me/916382619604"
                  target="_blank"
                  rel="noopener"
                  aria-label="WhatsApp"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-500 hover:bg-green-600 transition"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.98L0 24l6.27-1.64A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.68-.5-5.27-1.44l-.38-.22-3.73.98.99-3.63-.24-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.37-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.99 2.43.01 1.43 1.03 2.81 1.17 3 .14.19 2.03 3.1 4.93 4.22.69.27 1.23.43 1.65.55.69.22 1.32.19 1.82.12.56-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" /></svg>
                </a>
                <a
                  href="mailto:dineshg1729@gmail.com"
                  aria-label="Email"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 transition"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 13.065L2.4 6.6V18h19.2V6.6l-9.6 6.465zm9.6-10.065H2.4C1.08 3 0 4.08 0 5.4v13.2C0 19.92 1.08 21 2.4 21h19.2c1.32 0 2.4-1.08 2.4-2.4V5.4c0-1.32-1.08-2.4-2.4-2.4zm0 2.4v.511l-9.6 6.489-9.6-6.489V5.4h19.2z" /></svg>
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener"
                  aria-label="Instagram"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 hover:opacity-90 transition"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.782 2.295 7.148 2.233 8.414 2.175 8.794 2.163 12 2.163zm0-2.163C8.736 0 8.332.012 7.052.07 5.771.127 4.635.385 3.678 1.342 2.721 2.299 2.463 3.435 2.406 4.716 2.348 5.996 2.336 6.4 2.336 12s.012 6.004.07 7.284c.057 1.281.315 2.417 1.272 3.374.957.957 2.093 1.215 3.374 1.272C8.332 23.988 8.736 24 12 24s3.668-.012 4.948-.07c1.281-.057 2.417-.315 3.374-1.272.957-.957 1.215-2.093 1.272-3.374.058-1.28.07-1.684.07-7.284s-.012-6.004-.07-7.284c-.057-1.281-.315-2.417-1.272-3.374C19.365.385 18.229.127 16.948.07 15.668.012 15.264 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" /></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <nav className="text-center md:text-left">
              <h5 className="font-semibold text-orange-300 mb-2">Quick Links</h5>
              <ul className="space-y-1 text-gray-300">
                <li>
                  <a href="/" className="hover:text-orange-400 transition">Home</a>
                </li>
                <li>
                  <a href="#menu" className="hover:text-orange-400 transition">Menu</a>
                </li>
                <li>
                  <a href="#order" className="hover:text-orange-400 transition">Order Online</a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-orange-400 transition">Contact</a>
                </li>
              </ul>
            </nav>

            {/* Contact & Address */}
            <div className="text-center md:text-left">
              <h5 className="font-semibold text-orange-300 mb-2">Contact Us</h5>
              <address className="not-italic text-gray-300 mb-2">
                123, Main Road, Tirunelveli, Tamil Nadu, India<br />
                <a href="tel:+919876543210" className="hover:text-orange-400 transition block">+91 98765 43210</a>
                <a href="mailto:dineshg1729@gmail.com" className="hover:text-orange-400 transition block">dineshg1729@gmail.com</a>
              </address>
              <div className="flex justify-center md:justify-start gap-2">
                <span className="text-xs text-gray-400">Open: 8am - 10pm | All Days</span>
              </div>
            </div>
          </div>

          {/* SEO & Legal */}
          <div className="border-t border-orange-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-2">
            <div>
              &copy; {new Date().getFullYear()} Dosa Cafe. All rights reserved.
              <span className="mx-2">|</span>
              <a href="/privacy-policy" className="hover:text-orange-300">Privacy Policy</a>
              <span className="mx-2">|</span>
              <a href="/terms" className="hover:text-orange-300">Terms of Service</a>
            </div>
            <div>
              <span itemScope itemType="https://schema.org/Restaurant">
                <meta itemProp="name" content="Dosa Cafe" />
                <meta itemProp="address" content="123, Main Road, Tirunelveli, Tamil Nadu, India" />
                <meta itemProp="telephone" content="+919876543210" />
                <meta itemProp="servesCuisine" content="South Indian" />
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
