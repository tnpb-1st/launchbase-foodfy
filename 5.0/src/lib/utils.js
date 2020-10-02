module.exports = {
    age(timestamp) {
        const today = new Date(); // como nenhum argumento foi fornecido, o construtor criará um objeto Javascript Date
                                // com a data e hora correntes de acordo com informações do sistema
        const birthDate = new Date(timestamp); // data do timesTamp(aniversário da pessoa)

        // 2020 - ano de nascimento
        let age = today.getFullYear() - birthDate.getFullYear();

        const month = today.getMonth() - birthDate.getMonth();
        // mês atual - mês de aniversário

        if ((month <= 0) && ((today.getDate() - birthDate.getDate()) < 0)) { // não passamos do mês de aniversário
            age -= 1;
        }
        return age
    }, 
    date(timestamp) { 
        const date = new Date(timestamp);

        //yyyy
        const year = date.getUTCFullYear();

        //mm
        let month = date.getUTCMonth() + 1; // 0 a 11

        // dd 
        let day = date.getUTCDate();

        // checking month and day formats
        if (month.toString().length == 1) {
            month = '0' + `${month}`;
        }

        if (day.toString().length == 1) {
            day = '0' + `${day}`;
        }

        //return yyyy-mm-dd
        return {
            iso: `${year}-${month}-${day}`,
            day,
            month,
            year,
            format: `${day}/${month}/${year}`,
            birthday: `${day}/${month}`
        }
    },

    formatDate(string) {
        // yyyy-mm-dd

        const day = string.slice(-2);
        const month = string.slice(5, 7);
        const year = string.slice(0, 4);

        return `${day}/${month}/${year}`;
    }
}