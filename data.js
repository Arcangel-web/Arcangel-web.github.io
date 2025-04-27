const nama = "ARCANGEL"; //variabel JS bisa dengan const (const tidak akan bisa diubah bagaimanapun caranya) atau let
let usia = 18; //int, float tanpa string("...")
/*console.log(nama); //memanggil variabel nama
console.log(usia); */
//console.log(`nama saya adalah`,nama,` dan usia saya adalah`,usia); //bisa seperti ini

let biodata = document.getElementById('biodata');
console.log(biodata);

function generateBiodata() {
    let generasi;

    if(usia >= 10 && usia <=18) { //jika === maka membandingkan nilai dan tipe datanya juga(int, float, string, dll)
        //console.log(`anda remaja`);
        generasi = "remaja";
    } else if(usia > 18 && usia < 30) {
        generasi = "dewasa";
    } else if(usia >= 30) {
        generasi = "tuwa😂";
    } else if(usia < 10 && usia > 2) {
        generasi = "anak-anak";
    } else {
        generasi = "bayi";
    }
    return biodata.innerHTML = generasi;
    //return console.log('generasi saya adalah',generasi); //setiap function sebaiknya memiliki pengembalian/return
    //console.log(`nama saya adalah ${nama} dan usia saya ${usia} tahun`); //kiri angka 1(`)
}

console.log(nama);
console.log(usia);

generateBiodata();