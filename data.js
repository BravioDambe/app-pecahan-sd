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
    // Placeholders for future classes
    class4: {},
    class5: {},
    class6: {}
};