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
                <li>Memahami arti setengah (1/2).</li>
                <li>Memahami arti sepertiga (1/3).</li>
                <li>Memahami arti seperempat (1/4).</li>
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
                title: "Satu per Dua (1/2)",
                text: "Jika 1 kue dipotong menjadi 2 bagian sama besar, setiap bagian disebut 'Setengah' atau 'Satu per Dua'.",
                visualType: "fraction",
                numerator: 1,
                denominator: 2,
                visualColor: "#FFDF64"
            },
            {
                title: "Satu per Tiga (1/3)",
                text: "Jika 1 kue dipotong menjadi 3 bagian sama besar, setiap bagian disebut 'Sepertiga'.",
                visualType: "fraction",
                numerator: 1,
                denominator: 3,
                visualColor: "#88D498"
            },
            {
                title: "Satu per Empat (1/4)",
                text: "Jika 1 kue dipotong menjadi 4 bagian sama besar, setiap bagian disebut 'Seperempat'.",
                visualType: "fraction",
                numerator: 1,
                denominator: 4,
                visualColor: "#4FB0C6"
            }
        ],
        gameLevel: {
            title: "Bantu Ibu membagi Pizza!",
            instruction: "Tarik potongan <b>1/2 (Setengah)</b> ke piring!",
            targetValue: 0.5, // 1/2
            items: [
                { id: 'p1', val: 0.5, label: '1/2', color: '#FF6B6B', denominator: 2 },
                { id: 'p2', val: 0.25, label: '1/4', color: '#88D498', denominator: 4 },
                { id: 'p3', val: 0.33, label: '1/3', color: '#FFDF64', denominator: 3 },
                { id: 'p4', val: 0.25, label: '1/4', color: '#4FB0C6', denominator: 4 },
                { id: 'p5', val: 0.5, label: '1/2', color: '#FF6B6B', denominator: 2 },
                { id: 'p6', val: 0.33, label: '1/3', color: '#FFDF64', denominator: 3 }
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
    
    // KELAS 4: Comprehensive Curriculum
    class4: {
        themeColor: '#9C27B0',
        tujuan: `
            <h1>Tujuan Belajar (Kelas 4)</h1>
            <ul style="font-size: 1.2em; line-height: 1.8; text-align: left;">
                <li><b>Pecahan Senilai:</b> Memahami bahwa 1/2 itu sama dengan 2/4 atau 50/100.</li>
                <li><b>Menyederhanakan:</b> Mengubah pecahan besar menjadi sederhana.</li>
                <li><b>Membandingkan:</b> Membedakan mana yang lebih besar, 1/3 atau 1/5?</li>
                <li><b>Konversi:</b> Mengubah Pecahan ke Desimal dan Persen.</li>
            </ul>
        `,
        slides: [
            {
                title: "Pecahan Senilai",
                text: "Lihat gambar di samping. 1/2 lingkaran (Kuning) sama besarnya dengan 2/4 lingkaran (Merah). Walaupun potongannya lebih banyak, jumlah yang dimakan sama!",
                visualType: "fraction",
                numerator: 2,
                denominator: 4,
                visualColor: "#FF6B6B"
            },
            {
                title: "Menyederhanakan",
                text: "Pecahan 4/8 bisa disederhanakan menjadi 1/2. Caranya? Bagi atas dan bawah dengan angka yang sama (dibagi 4).",
                visualType: "fraction",
                numerator: 4,
                denominator: 8,
                visualColor: "#88D498"
            },
            {
                title: "Membandingkan (Hati-hati!)",
                text: "Mana lebih besar: 1/3 atau 1/5? Ingat! Semakin banyak yang membagi (penyebut besar), semakin KECIL potongannya. Jadi, 1/3 LEBIH BESAR dari 1/5.",
                visualType: "fraction",
                numerator: 1,
                denominator: 5,
                visualColor: "#FFDF64"
            },
            {
                title: "Desimal & Persen",
                text: "Pecahan bisa ditulis bentuk lain. 1/2 itu sama dengan 0.5 (Desimal) dan sama dengan 50% (Persen).",
                visualType: "text",
                label: "1/2 = 0.5 = 50%",
                color: "#9C27B0"
            },
            {
                title: "Penjumlahan",
                text: "Jika penyebutnya sama, cukup jumlahkan atasnya. 1/5 + 2/5 = 3/5. Bawahnya jangan dijumlahkan ya!",
                visualType: "fraction",
                numerator: 3,
                denominator: 5,
                visualColor: "#4FB0C6"
            }
        ],
        gameLevel: {
            title: "Lab Pecahan Senilai",
            instruction: "Tarik semua kartu yang nilainya <b>SAMA dengan 1/2</b> ke dalam timbangan!",
            targetValue: 0.5,
            items: [
                { id: 'c4_1', val: 0.5, label: '2/4', type: 'fraction', numerator: 2, denominator: 4, color: '#FF6B6B' }, // Correct
                { id: 'c4_2', val: 0.5, label: '0.5', type: 'text', color: '#9C27B0' }, // Correct
                { id: 'c4_3', val: 0.5, label: '50%', type: 'text', color: '#FF9800' }, // Correct
                { id: 'c4_4', val: 0.5, label: '4/8', type: 'fraction', numerator: 4, denominator: 8, color: '#4CAF50' }, // Correct
                { id: 'c4_5', val: 0.33, label: '1/3', type: 'fraction', numerator: 1, denominator: 3, color: '#03A9F4' }, // Wrong
                { id: 'c4_6', val: 0.25, label: '1/4', type: 'fraction', numerator: 1, denominator: 4, color: '#E91E63' }, // Wrong
                { id: 'c4_7', val: 0.75, label: '3/4', type: 'text', color: '#795548' }, // Wrong
                { id: 'c4_8', val: 0.2, label: '1/5', type: 'text', color: '#607D8B' } // Wrong
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

    class5: {},
    class6: {}
};