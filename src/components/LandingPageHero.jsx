import React from 'react';
import Link from 'next/link';
import { Typography, Button, Container, Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { useRouter } from 'next/router';

const LandingPage = () => {

    const StyledButton = styled(Button)`
        background-color: #D4AF37;
        width: 20vw;

        @media (max-width: 768px) {
            width: 20vw;
            font-size: 0.75em;
            padding-bottom: 0;
            padding-top: 1px;
            line-height: 1.3;
        }

        @media (max-width: 321px) {
            width: 25vw;
        }
    `;

    return (
        <div style={{paddingBottom: "45px"}}>
            <Container style={{ color: "grey" }}>
                <Grid container spacing={3} style={{ marginTop: '10px' }}>
                    <Grid item xs={12} md={6}>
                        <Typography style={{ color: "#D4AF37" }} variant="h2" gutterBottom>
                            Destaque-se
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            Estude por resumos focados! Específicos das matérias que vão cair na sua prova amanhã!
                        </Typography>
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '20px' }}> {/* Adicionado estilo flex */}
                            <Link href="/Geral" passHref>
                                <StyledButton color="primary" variant="contained">
                                    COMPRAR RESUMOS
                                </StyledButton>
                            </Link>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3}>
                            <img src="/img/PhotoReal_medical_school_students_taking_exam_3.jpg" alt="Ilustração da Medicina" style={{ width: '100%', height: 'auto', display: 'block', maxWidth: '100%' }} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default LandingPage;
