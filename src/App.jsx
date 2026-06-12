<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MandsaurGarlic.com - B2B Marketplace</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-50 font-sans text-gray-800">

    <!-- Top Navigation Bar -->
    <header class="bg-emerald-700 text-white sticky top-0 z-50 shadow-md">
        <div class="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
            <div class="flex items-center space-x-2">
                <i class="fa-solid fa-seedling text-2xl text-lime-400"></i>
                <span class="font-bold text-xl tracking-tight">MandsaurGarlic<span class="text-lime-400">.com</span></span>
            </div>
            <div class="flex items-center space-x-4">
                <button class="relative p-1">
                    <i class="fa-solid fa-bell text-xl"></i>
                    <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold border border-lime-400">
                    K
                </div>
            </div>
        </div>
    </header>

    <!-- Main Mobile Container -->
    <main class="max-w-md mx-auto px-4 pt-4 pb-24 space-y-5">

        <!-- Real-Time Mandi Bhav Ticker -->
        <section class="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl p-4 shadow-lg">
            <div class="flex justify-between items-center mb-2">
                <h3 class="text-sm font-semibold tracking-wide text-emerald-300 uppercase">⚡ Live Mandi Bhav</h3>
                <span class="text-xs bg-emerald-600 px-2 py-0.5 rounded-full text-lime-300 animate-pulse">Live</span>
            </div>
            <div class="grid grid-cols-2 gap-3 mt-1">
                <div class="bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-700/50">
                    <p class="text-xs text-emerald-300">Mandsaur (Amrit)</p>
                    <p class="text-lg font-bold">₹12,500 <span class="text-xs text-lime-400 font-normal"><i class="fa-solid fa-arrow-up"></i> 3%</span></p>
                    <p class="text-[10px] text-emerald-400">per quintal</p>
                </div>
                <div class="bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-700/50">
                    <p class="text-xs text-emerald-300">Vashi Mandi (Mumbai)</p>
                    <p class="text-lg font-bold">₹14,200 <span class="text-xs text-lime-400 font-normal"><i class="fa-solid fa-arrow-up"></i> 5%</span></p>
                    <p class="text-[10px] text-emerald-400">per quintal</p>
                </div>
            </div>
        </section>

        <!-- Quick Actions Grid -->
        <section class="grid grid-cols-2 gap-3">
            <button onclick="openModal('listModal')" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center active:scale-95 transition-transform">
                <div class="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center text-emerald-700 mb-2">
                    <i class="fa-solid fa-plus text-xl"></i>
                </div>
                <span class="font-semibold text-sm">Garlic Bechein</span>
                <span class="text-[11px] text-gray-400">Kisan Listing</span>
            </button>
            <button class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center active:scale-95 transition-transform">
                <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 mb-2">
                    <i class="fa-solid fa-truck-fast text-xl"></i>
                </div>
                <span class="font-semibold text-sm">Logistics Book Karein</span>
                <span class="text-[11px] text-gray-400">Instant Freight</span>
            </button>
        </section>

        <!-- Active Marketplace Section -->
        <section class="space-y-3">
            <div class="flex justify-between items-center">
                <h2 class="text-lg font-bold text-gray-900">Active Garlic Batches</h2>
                <button class="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    Filter <i class="fa-solid fa-sliders"></i>
                </button>
            </div>

            <!-- Garlic Listing Card 1 -->
            <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
                <div class="flex justify-between items-start">
                    <div class="flex gap-3">
                        <div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl border border-gray-200">
                            🧄
                        </div>
                        <div>
                            <span class="bg-lime-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Grade A (Premium)</span>
                            <h4 class="font-bold text-gray-900 mt-0.5">Mandsaur Desi Garlic</h4>
                            <p class="text-xs text-gray-500"><i class="fa-solid fa-location-dot"></i> Yala Mandi, Mandsaur</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-gray-400">Available Qty</p>
                        <p class="font-bold text-emerald-700">45 Quintals</p>
                    </div>
                </div>
                
                <div class="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl text-xs">
                    <div>
                        <p class="text-gray-400">Expected Price</p>
                        <p class="font-bold text-gray-900 text-sm">₹12,200/Qt</p>
                    </div>
                    <div class="text-right">
                        <p class="text-emerald-600 font-medium"><i class="fa-solid fa-shield-halved"></i> Escrow Secured</p>
                        <p class="text-[10px] text-gray-400">Verified Seller</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2 pt-1">
                    <button class="w-full bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 active:bg-emerald-800">
                        <i class="fa-solid fa-gavel"></i> Bid Lagayein
                    </button>
                    <button class="w-full border-2 border-emerald-700 text-emerald-700 font-semibold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 active:bg-emerald-50">
                        <i class="fa-brands fa-whatsapp text-sm text-green-600"></i> WhatsApp Chat
                    </button>
                </div>
            </div>
        </section>

    </main>

    <!-- Floating Navigation Bar for Mobile -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-50">
        <div class="max-w-md mx-auto grid grid-cols-4 h-16">
            <button class="flex flex-col items-center justify-center text-emerald-700">
                <i class="fa-solid fa-house text-lg"></i>
                <span class="text-[10px] mt-1 font-medium">Home</span>
            </button>
            <button class="flex flex-col items-center justify-center text-gray-400 hover:text-emerald-700">
                <i class="fa-solid fa-chart-line text-lg"></i>
                <span class="text-[10px] mt-1 font-medium">Mandi Bhav</span>
            </button>
            <button class="flex flex-col items-center justify-center text-gray-400 hover:text-emerald-700">
                <i class="fa-solid fa-wallet text-lg"></i>
                <span class="text-[10px] mt-1 font-medium">Escrow</span>
            </button>
            <button class="flex flex-col items-center justify-center text-gray-400 hover:text-emerald-700">
                <i class="fa-solid fa-user text-lg"></i>
                <span class="text-[10px] mt-1 font-medium">Profile</span>
            </button>
        </div>
    </nav>

    <!-- Sample Modal Logic Placeholder -->
    <script>
        function openModal(id) {
            alert("100x Architecture: Upload feature running. Photo processing engine starting up!");
        }
    </script>
</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - MandsaurGarlic.com</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Custom styles to hide standard radio buttons and use cards */
        .role-radio:checked + div {
            border-color: #047857; /* Emerald 700 */
            background-color: #ecfdf5; /* Emerald 50 */
        }
        .role-radio:checked + div .check-icon {
            opacity: 1;
        }
    </style>
</head>
<body class="bg-gray-50 font-sans text-gray-800 h-screen flex flex-col">

    <!-- Login Container -->
    <main class="max-w-md w-full mx-auto p-6 flex-1 flex flex-col justify-center">
        
        <!-- Branding -->
        <div class="text-center mb-10">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <i class="fa-solid fa-seedling text-3xl text-emerald-700"></i>
            </div>
            <h1 class="text-2xl font-bold tracking-tight">MandsaurGarlic<span class="text-lime-500">.com</span></h1>
            <p class="text-gray-500 text-sm mt-1">Bharat ka No.1 Garlic Marketplace</p>
        </div>

        <!-- Step 1: Phone Number & Role -->
        <div id="step-phone" class="space-y-6">
            
            <!-- Role Selection -->
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Aap Kaun Hain?</label>
                <div class="grid grid-cols-2 gap-4">
                    <label class="relative cursor-pointer">
                        <input type="radio" name="role" value="kisan" class="role-radio sr-only" checked>
                        <div class="border-2 border-gray-200 rounded-xl p-4 text-center transition-all">
                            <i class="fa-solid fa-tractor text-2xl text-emerald-700 mb-2"></i>
                            <div class="font-bold text-gray-900">Kisan</div>
                            <div class="text-[10px] text-gray-500">Garlic Bechna Hai</div>
                            <i class="fa-solid fa-circle-check check-icon text-emerald-600 absolute top-2 right-2 opacity-0 transition-opacity"></i>
                        </div>
                    </label>
                    <label class="relative cursor-pointer">
                        <input type="radio" name="role" value="vyapari" class="role-radio sr-only">
                        <div class="border-2 border-gray-200 rounded-xl p-4 text-center transition-all">
                            <i class="fa-solid fa-briefcase text-2xl text-emerald-700 mb-2"></i>
                            <div class="font-bold text-gray-900">Vyapari</div>
                            <div class="text-[10px] text-gray-500">Garlic Kharidna Hai</div>
                            <i class="fa-solid fa-circle-check check-icon text-emerald-600 absolute top-2 right-2 opacity-0 transition-opacity"></i>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Phone Number Input -->
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                <div class="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-emerald-600 transition-colors bg-white">
                    <span class="px-4 text-gray-500 font-semibold border-r border-gray-200 bg-gray-50">+91</span>
                    <input type="tel" id="mobileNumber" placeholder="98765 43210" class="w-full px-4 py-3 outline-none font-bold text-lg text-gray-800" maxlength="10">
                </div>
            </div>

            <!-- Action Button -->
            <button onclick="sendOTP()" class="w-full bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-700/30 active:scale-95 transition-all flex items-center justify-center gap-2">
                <i class="fa-brands fa-whatsapp text-lg text-lime-400"></i> Get OTP on WhatsApp
            </button>
            <p class="text-center text-xs text-gray-400 mt-4">By continuing, you agree to our Terms & Conditions</p>
        </div>

        <!-- Step 2: OTP Verification (Hidden by default) -->
        <div id="step-otp" class="space-y-6 hidden">
            <div class="text-center">
                <h2 class="text-xl font-bold text-gray-900">Verify OTP</h2>
                <p class="text-sm text-gray-500 mt-1">OTP sent to <span id="displayNumber" class="font-bold text-gray-800"></span></p>
            </div>

            <!-- OTP Input -->
            <div class="flex justify-center gap-3">
                <input type="text" maxlength="1" class="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none bg-white">
                <input type="text" maxlength="1" class="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none bg-white">
                <input type="text" maxlength="1" class="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none bg-white">
                <input type="text" maxlength="1" class="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none bg-white">
            </div>

            <button onclick="verifyLogin()" class="w-full bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-700/30 active:scale-95 transition-all">
                Verify & Login
            </button>
            
            <div class="flex justify-between text-sm font-semibold mt-4">
                <button onclick="goBack()" class="text-gray-500"><i class="fa-solid fa-arrow-left"></i> Change Number</button>
                <button class="text-emerald-700">Resend OTP</button>
            </div>
        </div>

    </main>

    <!-- JavaScript for UI Flow -->
    <script>
        function sendOTP() {
            const number = document.getElementById('mobileNumber').value;
            if(number.length < 10) {
                alert("Please enter a valid 10-digit mobile number");
                return;
            }
            
            // UI Transition
            document.getElementById('step-phone').classList.add('hidden');
            document.getElementById('step-otp').classList.remove('hidden');
            document.getElementById('displayNumber').innerText = '+91 ' + number;
        }

        function goBack() {
            document.getElementById('step-otp').classList.add('hidden');
            document.getElementById('step-phone').classList.remove('hidden');
        }

        function verifyLogin() {
            // In a real app, this verifies the OTP with the backend and redirects to dashboard
            alert("OTP Verified! Redirecting to your Dashboard...");
            // window.location.href = '/dashboard.html';
        }
    </script>
</body>
</html>

