/**
 * ------------------------------------------------------------------
 * DATA DICTIONARY (CURRICULUM ENGINE)
 * ------------------------------------------------------------------
 */
const curriculumData = {
    class2: {
        themeColor: '#4FB0C6',
        tujuan: `
            <h1>Tujuan Belajar</h1>
            <ul style="font-size: 1.2em; line-height: 1.8; text-align: left;">
                <li>Mengenal pecahan sederhana.</li>
                <li>Memahami arti setengah (1/2), sepertiga (1/3), dan seperempat (1/4).</li>
                <li>Mengenal pecahan dengan penyebut ganjil (1/5).</li>
            </ul>
        `,
        slides: [
            {
                title: "Apa itu Pecahan?",
                text: "Pecahan adalah bagian dari benda yang utuh. Bayangkan kamu punya 1 kue utuh, lalu kamu memotongnya.",
                visualType: "whole",
                visualColor: "#FF6B6B"
            },
            {
                title: "Pecahan Ganjil (1/3 & 1/5)",
                text: "Pecahan tidak harus genap! Jika kue dipotong 3, satu bagian adalah 1/3. Jika dipotong 5, satu bagian adalah 1/5.",
                visualType: "fraction",
                numerator: 1,
                denominator: 5,
                visualColor: "#88D498"
            },
            {
                title: "Satu per Dua (1/2)",
                text: "Setengah adalah yang paling populer! 1 bagian dari 2 potong yang sama besar.",
                visualType: "fraction",
                numerator: 1,
                denominator: 2,
                visualColor: "#FFDF64"
            }
        ],
        gameLevel: {
            title: "Dapur Pecahan",
            instruction: "Tarik makanan yang nilainya <b>[TARGET]</b> ke piring!",
            targetIcon: "🍽",
            targets: [
                { val: 0.5, label: '1/2', type: 'fraction', numerator: 1, denominator: 2, color: '#FF6B6B' },
                { val: 0.333, label: '1/3', type: 'fraction', numerator: 1, denominator: 3, color: '#FFDF64' },
                { val: 0.25, label: '1/4', type: 'fraction', numerator: 1, denominator: 4, color: '#88D498' },
                { val: 0.2, label: '1/5', type: 'fraction', numerator: 1, denominator: 5, color: '#4FB0C6' },
                { val: 0.666, label: '2/3', type: 'fraction', numerator: 2, denominator: 3, color: '#9C27B0' }
            ],
            items: [
                { id: 'p1', val: 0.5, label: '1/2', type: 'fraction', color: '#FF6B6B', denominator: 2, numerator: 1 },
                { id: 'p2', val: 0.25, label: '1/4', type: 'fraction', color: '#88D498', denominator: 4, numerator: 1 },
                { id: 'p3', val: 0.333, label: '1/3', type: 'fraction', color: '#FFDF64', denominator: 3, numerator: 1 },
                { id: 'p4', val: 0.2, label: '1/5', type: 'fraction', color: '#4FB0C6', denominator: 5, numerator: 1 },
                { id: 'p5', val: 0.4, label: '2/5', type: 'fraction', color: '#9C27B0', denominator: 5, numerator: 2 },
                { id: 'p6', val: 0.666, label: '2/3', type: 'fraction', color: '#FF9800', denominator: 3, numerator: 2 },
                { id: 'p7', val: 0.75, label: '3/4', type: 'fraction', color: '#795548', denominator: 4, numerator: 3 },
                { id: 'p8', val: 0.5, label: '1/2', type: 'fraction', color: '#FF6B6B', denominator: 2, numerator: 1 },
                { id: 'p9', val: 0.333, label: '1/3', type: 'fraction', color: '#FFDF64', denominator: 3, numerator: 1 }
            ]
        },
        quiz: [
            {
                q: "Gambar manakah yang menunjukkan pecahan 1/2?",
                options: [
                    { label: "1 dari 3 bagian", correct: false },
                    { label: "1 dari 2 bagian", correct: true },
                    { label: "1 dari 4 bagian", correct: false },
                    { label: "Utuh", correct: false }
                ]
            },
            {
                q: "Ibu memotong kue menjadi 4 bagian sama besar. Satu bagian disebut...",
                options: [
                    { label: "Setengah", correct: false },
                    { label: "Sepertiga", correct: false },
                    { label: "Seperempat", correct: true },
                    { label: "Utuh", correct: false }
                ]
            },
            {
                q: "Lambang bilangan seperdua adalah...",
                options: [
                    { label: "1/4", correct: false },
                    { label: "1/3", correct: false },
                    { label: "1/2", correct: true },
                    { label: "1/1", correct: false }
                ]
            },
            {
                q: "Sebuah apel dipotong menjadi 3 bagian sama besar. Setiap bagian nilainya...",
                options: [
                    { label: "1/2", correct: false },
                    { label: "1/3", correct: true },
                    { label: "1/4", correct: false },
                    { label: "3/1", correct: false }
                ]
            },
            {
                q: "Manakah yang lebih besar? 1 kue utuh atau 1/2 kue?",
                options: [
                    { label: "1/2 kue", correct: false },
                    { label: "Sama saja", correct: false },
                    { label: "1 kue utuh", correct: true },
                    { label: "Tidak tahu", correct: false }
                ]
            },
            {
                q: "Siti memiliki sebuah kertas. Ia melipatnya menjadi 4 bagian sama besar. Nilai satu lipatan adalah...",
                options: [
                    { label: "Seperempat", correct: true },
                    { label: "Setengah", correct: false },
                    { label: "Sepertiga", correct: false },
                    { label: "Utuh", correct: false }
                ]
            },
            {
                q: "Benda yang dibagi menjadi dua bagian TIDAK sama besar, apakah disebut pecahan 1/2?",
                options: [
                    { label: "Ya", correct: false },
                    { label: "Tidak", correct: true },
                    { label: "Mungkin", correct: false },
                    { label: "Bisa jadi", correct: false }
                ]
            },
            {
                q: "Jika kamu makan 1 potong pizza dari 2 potong yang ada, kamu makan...",
                options: [
                    { label: "1/4 bagian", correct: false },
                    { label: "1/2 bagian", correct: true },
                    { label: "1/3 bagian", correct: false },
                    { label: "Semua", correct: false }
                ]
            }
        ]
    },
    
    class4: {
        themeColor: '#9C27B0',
        tujuan: `
            <h1>Tujuan Belajar (Kelas 4)</h1>
            <ul style="font-size: 1.2em; line-height: 1.8; text-align: left;">
                <li><b>Pecahan Senilai:</b> 1/2 = 2/4 = 0.5.</li>
                <li><b>Membandingkan:</b> Mana yang lebih berat atau lebih besar?</li>
            </ul>
        `,
        slides: [
            {
                title: "Pecahan Senilai",
                text: "1/2 lingkaran sama besarnya dengan 2/4. Walaupun namanya beda, nilainya SAMA!",
                visualType: "fraction",
                numerator: 2,
                denominator: 4,
                visualColor: "#FF6B6B"
            }
        ],
        gameLevel: {
            type: 'scales',
            title: "Timbangan Senilai",
            instruction: "Cari pecahan yang nilainya SAMA (Senilai)!",
            targets: [
                { val: 0.5, label: '1/2', type: 'fraction', numerator: 1, denominator: 2, color: '#FF6B6B' },
                { val: 0.25, label: '1/4', type: 'fraction', numerator: 1, denominator: 4, color: '#88D498' },
                { val: 0.75, label: '3/4', type: 'fraction', numerator: 3, denominator: 4, color: '#2196F3' },
                { val: 0.2, label: '1/5', type: 'fraction', numerator: 1, denominator: 5, color: '#4FB0C6' },
                { val: 0.4, label: '2/5', type: 'fraction', numerator: 2, denominator: 5, color: '#9C27B0' },
                { val: 0.666, label: '2/3', type: 'fraction', numerator: 2, denominator: 3, color: '#FF9800' }
            ],
            draggables: [
                { val: 0.5, label: '2/4', type: 'fraction', numerator: 2, denominator: 4, color: '#FF6B6B' },
                { val: 0.5, label: '0.5', type: 'text', color: '#9C27B0' },
                { val: 0.5, label: '3/6', type: 'fraction', numerator: 3, denominator: 6, color: '#FF5722' },
                { val: 0.25, label: '2/8', type: 'fraction', numerator: 2, denominator: 8, color: '#88D498' },
                { val: 0.25, label: '0.25', type: 'text', color: '#4CAF50' },
                { val: 0.75, label: '6/8', type: 'fraction', numerator: 6, denominator: 8, color: '#2196F3' },
                { val: 0.75, label: '0.75', type: 'text', color: '#3F51B5' },
                { val: 0.2, label: '2/10', type: 'fraction', numerator: 2, denominator: 10, color: '#00BCD4' },
                { val: 0.2, label: '0.2', type: 'text', color: '#009688' },
                { val: 0.4, label: '4/10', type: 'fraction', numerator: 4, denominator: 10, color: '#9C27B0' },
                { val: 0.4, label: '0.4', type: 'text', color: '#673AB7' },
                { val: 0.666, label: '4/6', type: 'fraction', numerator: 4, denominator: 6, color: '#FFC107' },
                { val: 0.1, label: '1/10', type: 'text', color: '#607D8B' },
                { val: 0.8, label: '4/5', type: 'fraction', numerator: 4, denominator: 5, color: '#795548' },
                { val: 0.3, label: '0.3', type: 'text', color: '#E91E63' }
            ]
        },
        quiz: [
            {
                q: "Pecahan manakah yang senilai dengan 1/2?",
                options: [
                    { label: "2/4", correct: true },
                    { label: "1/3", correct: false },
                    { label: "3/5", correct: false },
                    { label: "1/4", correct: false }
                ]
            },
            {
                q: "Bentuk desimal dari 1/2 adalah...",
                options: [
                    { label: "0.2", correct: false },
                    { label: "0.5", correct: true },
                    { label: "0.1", correct: false },
                    { label: "1.2", correct: false }
                ]
            },
            {
                q: "Mana yang lebih KECIL? 1/3 atau 1/8?",
                options: [
                    { label: "1/3", correct: false },
                    { label: "1/8", correct: true },
                    { label: "Sama besar", correct: false },
                    { label: "Tidak tahu", correct: false }
                ]
            },
            {
                q: "Bentuk paling sederhana dari 50/100 adalah...",
                options: [
                    { label: "5/10", correct: false },
                    { label: "1/2", correct: true },
                    { label: "1/4", correct: false },
                    { label: "2/5", correct: false }
                ]
            },
            {
                q: "2/7 + 3/7 = ...",
                options: [
                    { label: "5/14", correct: false },
                    { label: "5/7", correct: true },
                    { label: "6/7", correct: false },
                    { label: "1/7", correct: false }
                ]
            },
            {
                q: "Angka 25% jika diubah menjadi pecahan biasa adalah...",
                options: [
                    { label: "1/2", correct: false },
                    { label: "1/5", correct: false },
                    { label: "1/4", correct: true },
                    { label: "3/4", correct: false }
                ]
            },
            {
                q: "Pecahan 6/12 jika disederhanakan menjadi...",
                options: [
                    { label: "1/3", correct: false },
                    { label: "1/2", correct: true },
                    { label: "2/3", correct: false },
                    { label: "3/4", correct: false }
                ]
            },
            {
                q: "Ibu membeli 0.5 kg gula. Itu sama dengan...",
                options: [
                    { label: "Setengah kilo", correct: true },
                    { label: "Seperempat kilo", correct: false },
                    { label: "Satu kilo", correct: false },
                    { label: "Sepertiga kilo", correct: false }
                ]
            }
        ]
    },

    class5: {
        themeColor: '#009688',
        tujuan: `
            <h1>Tujuan Belajar (Kelas 5)</h1>
            <ul style="font-size: 1.2em; line-height: 1.8; text-align: left;">
                <li><b>Penjumlahan Pecahan:</b> Belajar menjumlahkan pecahan dengan penyebut berbeda (KPK).</li>
                <li><b>Visualisasi:</b> Melihat bagaimana 1/2 + 1/3 digabung menjadi satu.</li>
            </ul>
        `,
        slides: [
            {
                title: "Penjumlahan Pecahan",
                text: "Jika penyebutnya sama, tinggal jumlahkan atasnya. 1/5 + 2/5 = 3/5. Mudah kan?",
                visualType: "beaker",
                numerator: 3,
                denominator: 5,
                visualColor: "#4FB0C6"
            },
            {
                title: "Beda Penyebut? Bahaya!",
                text: "1/2 + 1/4 TIDAK BISA langsung dijumlah. Kita harus samakan dulu penyebutnya (KPK).",
                visualType: "beaker",
                numerator: 1,
                denominator: 2,
                visualColor: "#FF6B6B"
            },
            {
                title: "Menyamakan Penyebut",
                text: "Ubah 1/2 menjadi 2/4. Sekarang 2/4 + 1/4 = 3/4. Berhasil!",
                visualType: "beaker",
                numerator: 3,
                denominator: 4,
                visualColor: "#9C27B0"
            }
        ],
        gameLevel: {
            type: 'lab',
            title: "Lab Ramuan Pecahan",
            instruction: "Campur kedua ramuan ini! Berapa hasilnya?",
            problems: [
                {
                    a: { n: 1, d: 2, color: '#FF6B6B' }, // 1/2
                    b: { n: 1, d: 2, color: '#FF6B6B' }, // 1/2
                    res: { n: 1, d: 1, val: 1.0 }, // 1
                    display: "1/2 + 1/2 = ?"
                },
                {
                    a: { n: 1, d: 3, color: '#FFDF64' }, // 1/3
                    b: { n: 1, d: 3, color: '#FFDF64' }, // 1/3
                    res: { n: 2, d: 3, val: 0.666 }, // 2/3
                    display: "1/3 + 1/3 = ?"
                },
                {
                    a: { n: 1, d: 4, color: '#88D498' }, // 1/4
                    b: { n: 2, d: 4, color: '#88D498' }, // 2/4
                    res: { n: 3, d: 4, val: 0.75 }, // 3/4
                    display: "1/4 + 2/4 = ?"
                },
                // Harder (Different denominators)
                {
                    a: { n: 1, d: 2, color: '#FF6B6B' }, // 1/2
                    b: { n: 1, d: 4, color: '#88D498' }, // 1/4
                    res: { n: 3, d: 4, val: 0.75 }, // 3/4
                    display: "1/2 + 1/4 = ?"
                },
                {
                    a: { n: 1, d: 2, color: '#FF6B6B' }, // 1/2
                    b: { n: 1, d: 3, color: '#FFDF64' }, // 1/3
                    res: { n: 5, d: 6, val: 0.833 }, // 5/6
                    display: "1/2 + 1/3 = ?"
                }
            ],
            draggables: [
                { val: 1.0, label: '1', type: 'beaker', numerator: 1, denominator: 1, color: '#333' },
                { val: 0.75, label: '3/4', type: 'beaker', numerator: 3, denominator: 4, color: '#9C27B0' },
                { val: 0.666, label: '2/3', type: 'beaker', numerator: 2, denominator: 3, color: '#FF9800' },
                { val: 0.833, label: '5/6', type: 'beaker', numerator: 5, denominator: 6, color: '#00BCD4' },
                { val: 0.5, label: '1/2', type: 'beaker', numerator: 1, denominator: 2, color: '#FF6B6B' },
                { val: 0.25, label: '1/4', type: 'beaker', numerator: 1, denominator: 4, color: '#88D498' },
                { val: 0.4, label: '2/5', type: 'beaker', numerator: 2, denominator: 5, color: '#795548' },
                { val: 0.6, label: '3/5', type: 'beaker', numerator: 3, denominator: 5, color: '#607D8B' }
            ]
        },
        quiz: [
            {
                q: "1/3 + 1/3 = ...",
                options: [
                    { label: "2/6", correct: false },
                    { label: "2/3", correct: true },
                    { label: "1/6", correct: false },
                    { label: "1/9", correct: false }
                ]
            },
            {
                q: "Untuk menjumlahkan 1/2 + 1/3, kita harus mencari KPK dari 2 dan 3. KPK-nya adalah...",
                options: [
                    { label: "5", correct: false },
                    { label: "6", correct: true },
                    { label: "12", correct: false },
                    { label: "23", correct: false }
                ]
            },
            {
                q: "1/2 + 1/4 = ...",
                options: [
                    { label: "2/6", correct: false },
                    { label: "3/4", correct: true },
                    { label: "2/4", correct: false },
                    { label: "1/6", correct: false }
                ]
            },
            {
                q: "Hasil dari 1 - 1/2 adalah...",
                options: [
                    { label: "1/2", correct: true },
                    { label: "0", correct: false },
                    { label: "1/4", correct: false },
                    { label: "1", correct: false }
                ]
            },
            {
                q: "2/5 + 3/5 = ...",
                options: [
                    { label: "5/10", correct: false },
                    { label: "1 (Utuh)", correct: true },
                    { label: "6/5", correct: false },
                    { label: "5/55", correct: false }
                ]
            }
        ]
    }
};